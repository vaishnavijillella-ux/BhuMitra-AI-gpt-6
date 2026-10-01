import React, { useState, useEffect, useRef } from 'react';
import { Crop } from '../data/crops';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  Send,
  Mic,
  MicOff,
  Sparkles,
  Camera,
  X,
  HelpCircle,
  Clock,
  Layers,
} from 'lucide-react';

interface QuestionBoxProps {
  language: Language;
  selectedCrop: Crop | null;
  question: string;
  onQuestionChange: (val: string) => void;
  onSubmit: (cropStage?: string) => void;
  isLoading: boolean;
  onOpenDoctor: () => void;
}

export const QuestionBox: React.FC<QuestionBoxProps> = ({
  language,
  selectedCrop,
  question,
  onQuestionChange,
  onSubmit,
  isLoading,
  onOpenDoctor,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  const getSpeechLang = (lang: Language) => {
    if (lang === 'ta') return 'ta-IN';
    if (lang === 'te') return 'te-IN';
    if (lang === 'hi') return 'hi-IN';
    return 'en-IN';
  };

  // Initialize SpeechRecognition if available in browser
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = getSpeechLang(language);

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          onQuestionChange(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, [language, onQuestionChange]);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.lang = getSpeechLang(language);
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.warn('Could not start recognition:', err);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (question.trim() && !isLoading) {
        onSubmit(selectedStage || undefined);
      }
    }
  };

  const getQuickQuestions = (): string[] => {
    if (selectedCrop) {
      if (language === 'ta') return selectedCrop.quickQuestions.ta;
      if (language === 'te') return selectedCrop.quickQuestions.te;
      if (language === 'hi') return selectedCrop.quickQuestions.hi;
      return selectedCrop.quickQuestions.en;
    }

    if (language === 'ta') {
      return [
        'இயற்கை உரம் தயாரிப்பது எப்படி?',
        'பூச்சித் தாக்குதலை ஆரம்பத்திலேயே தடுப்பது எப்படி?',
        'சொட்டு நீர் பாசனத்தின் நன்மைகள் என்ன?',
        'மண் வளத்தை அதிகப்படுத்த என்ன செய்ய வேண்டும்?'
      ];
    }
    if (language === 'te') {
      return [
        'ఇంట్లోనే సేంద్రీయ ఎరువును ఎలా తయారు చేసుకోవాలి?',
        'ప్రారంభ దశలోనే పురుగుల తాకిడిని ఎలా నివారించాలి?',
        'బిందు సేద్యం (డ్రిప్ ఇరిగేషన్) యొక్క ఉత్తమ పద్ధతులు ఏమిటి?',
        'నేల సారాన్ని మరియు సేంద్రీయ కర్బనాన్ని ఎలా పెంచాలి?'
      ];
    }
    if (language === 'hi') {
      return [
        'घर पर जैविक खाद और जीवामृत कैसे तैयार करें?',
        'फसल में कीटों के प्रकोप को शुरुआत में ही कैसे रोकें?',
        'ड्रिप (टपक) सिंचाई की सर्वोत्तम विधियां क्या हैं?',
        'मिट्टी की उर्वरता और जीवांश कार्बन कैसे बढ़ाएं?'
      ];
    }
    return [
      'How to prepare organic fertilizer at home?',
      'How to prevent pest outbreaks early?',
      'What are the best practices for drip irrigation?',
      'How to improve soil health and organic carbon?'
    ];
  };

  const quickQuestions = getQuickQuestions();

  const getCropDisplayName = () => {
    if (!selectedCrop) return '';
    if (language === 'ta') return selectedCrop.nameTa;
    if (language === 'te') return selectedCrop.nameTe;
    if (language === 'hi') return selectedCrop.nameHi;
    return selectedCrop.nameEn;
  };

  const getAskingAboutLabel = () => {
    if (language === 'ta') return 'தேர்வு:';
    if (language === 'te') return 'ఎంపిక చేసిన పంట:';
    if (language === 'hi') return 'चुनी गई फसल:';
    return 'Asking about:';
  };

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200/80">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold">
              2
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              {t.askQuestionTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 pl-9">
            {selectedCrop ? (
              <span>
                {getAskingAboutLabel()}{' '}
                <strong className="text-emerald-700">
                  {selectedCrop.icon}{' '}
                  {getCropDisplayName()}
                </strong>
              </span>
            ) : (
              <span className="text-amber-700">
                {t.noCropSelectedNotice}
              </span>
            )}
          </p>
        </div>

        {/* Quick button to open Photo Doctor */}
        <button
          onClick={onOpenDoctor}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-lime-100 hover:bg-lime-200 text-emerald-950 font-semibold text-xs border border-lime-300 transition-all shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Camera className="w-4 h-4 text-emerald-700" />
          <span>{language === 'ta' ? '📸 இலை நோய் புகைப்படம்' : '📸 Diagnose Sick Leaf / Pest'}</span>
        </button>
      </div>

      {/* Growth Stage Selector (Optional context) */}
      <div className="mb-3.5 p-3 rounded-2xl bg-stone-50 border border-stone-200/70">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-2">
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.cropStageLabel}</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {t.stages.map((stage) => {
            const isStageActive = selectedStage === stage;
            return (
              <button
                key={stage}
                type="button"
                onClick={() => setSelectedStage(isStageActive ? '' : stage)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isStageActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-emerald-300'
                }`}
              >
                {stage}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Textarea Container */}
      <div className="relative rounded-2xl border-2 border-emerald-500/40 focus-within:border-emerald-600 focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all bg-white overflow-hidden shadow-xs">
        <textarea
          value={question}
          onChange={(e) => onQuestionChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.askQuestionPlaceholder}
          rows={3}
          className="w-full p-4 pb-14 text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none resize-none leading-relaxed"
        />

        {/* Bottom toolbar inside input */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
          <div className="flex items-center gap-1.5">
            {/* Mic Voice Dictation button */}
            {speechSupported && (
              <button
                type="button"
                onClick={toggleListening}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-stone-100 text-stone-700 hover:bg-emerald-100 hover:text-emerald-800'
                }`}
                title={isListening ? t.stopVoiceInput : t.startVoiceInput}
              >
                {isListening ? (
                  <>
                    <MicOff className="w-4 h-4" />
                    <span className="text-[11px] hidden sm:inline">{t.listeningMic}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-emerald-700" />
                    <span className="text-[11px] hidden sm:inline">
                      {language === 'ta' ? 'குரல் உள்ளீடு' : 'Voice'}
                    </span>
                  </>
                )}
              </button>
            )}

            {/* Clear button if text exists */}
            {question && (
              <button
                type="button"
                onClick={() => onQuestionChange('')}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition"
                title={t.clearText}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="button"
            onClick={() => onSubmit(selectedStage || undefined)}
            disabled={!question.trim() || isLoading}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ${
              !question.trim() || isLoading
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white shadow-emerald-700/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.askingButton}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-lime-300" />
                <span>{t.askButton}</span>
                <Send className="w-3.5 h-3.5 ml-0.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Frequently Asked Sample Questions Chips */}
      <div className="mt-4 pt-3 border-t border-stone-100">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.quickQuestionsPrompt}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onQuestionChange(q);
              }}
              className="text-left text-xs bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200/70 hover:border-emerald-300 transition cursor-pointer flex items-center gap-1.5 group"
            >
              <span className="text-emerald-500 group-hover:text-emerald-700 font-bold">›</span>
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
