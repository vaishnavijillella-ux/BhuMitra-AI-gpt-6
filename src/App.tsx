import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CropSelector } from './components/CropSelector';
import { QuestionBox } from './components/QuestionBox';
import { AnswerCard } from './components/AnswerCard';
import { CropDoctor } from './components/CropDoctor';
import { WeatherForecast } from './components/WeatherForecast';
import { InfoBanner } from './components/InfoBanner';
import { CROPS, Crop } from './data/crops';
import { Language, TRANSLATIONS } from './data/translations';
import { AlertTriangle, Sparkles, CheckCircle2, Leaf, Sun, Droplets, Download, Camera } from 'lucide-react';
import { parseCurrentExportUrl, ExportPayload } from './utils/exportLinkUtils';
import { ExportView } from './components/ExportView';
import { BackgroundDesign } from './components/BackgroundDesign';
import { VisualPhotoModal } from './components/VisualPhotoModal';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeExportPayload, setActiveExportPayload] = useState<ExportPayload | null>(null);
  // Default to Paddy (first crop) so farmers immediately see rich context & sample questions
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(CROPS[0]);
  const [question, setQuestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [currentAnswer, setCurrentAnswer] = useState<{
    question: string;
    cropName: string;
    answer: string;
    sources: Array<{ title: string; uri: string }>;
  } | null>(null);

  const [isDoctorOpen, setIsDoctorOpen] = useState<boolean>(false);
  const [isPhotoStudioOpen, setIsPhotoStudioOpen] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [lastAudioBase64, setLastAudioBase64] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const answerSectionRef = useRef<HTMLDivElement | null>(null);
  const questionBoxRef = useRef<HTMLDivElement | null>(null);

  const t = TRANSLATIONS[language];

  // Check URL on load for export payload
  useEffect(() => {
    const payload = parseCurrentExportUrl();
    if (payload) {
      setActiveExportPayload(payload);
      if (payload.language) {
        setLanguage(payload.language);
      }
    }
  }, []);

  const handleBackToApp = () => {
    setActiveExportPayload(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleOpenExportView = (payload: ExportPayload) => {
    setActiveExportPayload(payload);
  };

  const handleAskWeatherQuestion = (weatherQ: string) => {
    setQuestion(weatherQ);
    setTimeout(() => {
      questionBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  // Stop audio if language switches or component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleLanguageChange = (newLang: Language) => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
    setLastAudioBase64(null);
    setLanguage(newLang);
  };

  const handleSelectCrop = (crop: Crop) => {
    setSelectedCrop(crop);
    // If there's an existing question that was from another crop preset, clear or update
    setErrorMessage(null);
  };

  const handleAskQuestion = async (cropStage?: string) => {
    if (!question.trim()) return;

    if (audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
    setLastAudioBase64(null);

    setIsLoading(true);
    setErrorMessage(null);

    const cropName = selectedCrop
      ? (language === 'ta'
          ? selectedCrop.nameTa
          : language === 'te'
          ? selectedCrop.nameTe
          : language === 'hi'
          ? selectedCrop.nameHi
          : selectedCrop.nameEn)
      : (language === 'ta'
          ? 'பொது வேளாண்மை'
          : language === 'te'
          ? 'సాధారణ వ్యవసాయం'
          : language === 'hi'
          ? 'सामान्य कृषि'
          : 'General Agriculture');

    try {
      const response = await fetch('/api/farming-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crop: cropName,
          question: question.trim(),
          language,
          cropStage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer from BhuMitra');
      }

      setCurrentAnswer({
        question: question.trim(),
        cropName,
        answer: data.answer,
        sources: data.sources || [],
      });

      // Smooth scroll to answer section
      setTimeout(() => {
        answerSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      console.error('Error fetching farming advice:', err);
      setErrorMessage(err.message || t.errorOccurred);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = async (text: string) => {
    // If currently speaking, stop it
    if (isSpeaking && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
      return;
    }

    setIsLoadingAudio(true);

    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Audio generation failed');
      }

      if (data.audioBase64) {
        setLastAudioBase64(data.audioBase64);
        const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
        audioRef.current = audio;

        audio.onplay = () => {
          setIsSpeaking(true);
          setIsLoadingAudio(false);
        };

        audio.onended = () => {
          setIsSpeaking(false);
          audioRef.current = null;
        };

        audio.onerror = () => {
          console.error('Audio playback error');
          setIsSpeaking(false);
          setIsLoadingAudio(false);
          audioRef.current = null;
        };

        await audio.play();
      }
    } catch (err: any) {
      console.error('TTS error:', err);
      setIsLoadingAudio(false);
      setIsSpeaking(false);
    }
  };

  if (activeExportPayload) {
    return (
      <ExportView
        payload={activeExportPayload}
        onBackToApp={handleBackToApp}
        language={language}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-100/70 flex flex-col font-sans relative">
      {/* Visual Background Designs & Topographic Agrarian Curves */}
      <BackgroundDesign />

      {/* Top Navbar */}
      <Navbar
        language={language}
        onLanguageChange={handleLanguageChange}
        selectedCrop={selectedCrop}
        onOpenPhotoStudio={() => setIsPhotoStudioOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Hero Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-green-950 text-white p-6 sm:p-8 shadow-lg border border-emerald-700/60">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/20 text-lime-300 text-xs font-bold uppercase tracking-wider mb-3 border border-lime-400/30">
              <Leaf className="w-3.5 h-3.5" />
              <span>
                {language === 'ta'
                  ? 'அறிவார்ந்த வேளாண் தொழில்நுட்பம்'
                  : language === 'te'
                  ? 'స్మార్ట్ వ్యవసాయ సాంకేతికత'
                  : language === 'hi'
                  ? 'स्मार्ट कृषि तकनीक'
                  : 'AI-Powered Smart Farming'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {t.appTitle}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-emerald-100 font-medium leading-relaxed">
              {t.subtitle}
            </p>

            {/* Quick stats / Highlights */}
            <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs text-emerald-200">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700">
                <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                <span>
                  {language === 'ta'
                    ? 'கூகுள் தேடல் உண்மைத் தரவுகள்'
                    : language === 'te'
                    ? 'గూగుల్ సెర్చ్ నిజమైన సమాచారం'
                    : language === 'hi'
                    ? 'गूगल सर्च प्रमाणिक डेटा'
                    : 'Google Search Grounding'}
                </span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                <span>
                  {language === 'ta'
                    ? 'இலை நோய் புகைப்பட பரிசோதனை'
                    : language === 'te'
                    ? 'పంట తెగుళ్ల ఫోటో విశ్లేషణ'
                    : language === 'hi'
                    ? 'फसल रोग फोटो निदान'
                    : 'Photo Disease Diagnosis'}
                </span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {language === 'ta'
                    ? 'தமிழ், தெலுங்கு, இந்தி & ஆங்கில குரல் வாசிப்பு'
                    : language === 'te'
                    ? 'తెలుగు, హిందీ, తమిళం & ఇంగ్లీష్ వాయిస్ రీడౌట్'
                    : language === 'hi'
                    ? 'हिंदी, तेलुगु, तमिल और अंग्रेजी आवाज सुविधा'
                    : 'Multilingual Voice Readout'}
                </span>
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700">
                <Download className="w-3.5 h-3.5 text-lime-400" />
                <span>
                  {language === 'ta'
                    ? 'ஆஃப்லைன் அறிக்கை பதிவிறக்கம்'
                    : language === 'te'
                    ? 'ఆఫ్‌లైన్ నివేదిక డౌన్‌లోడ్'
                    : language === 'hi'
                    ? 'ऑफलाइन रिपोर्ट डाउनलोड'
                    : 'Offline Field Downloads'}
                </span>
              </span>
              <button
                type="button"
                onClick={() => setIsPhotoStudioOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold transition shadow-xs cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>
                  {language === 'ta'
                    ? 'விளக்கப் புகைப்படங்கள்'
                    : language === 'te'
                    ? 'వివరణాత్మక ఫోటోలు'
                    : language === 'hi'
                    ? 'स्पष्ट फोटो बनाएं'
                    : 'Generate Visual Photos'}
                </span>
              </button>
            </div>
          </div>

          {/* Decorative background leaf accents */}
          <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none text-white text-[160px]">
            🌾
          </div>
        </section>

        {/* Global Error Notice if any */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {language === 'ta' ? 'பிழை ஏற்பட்டது' : 'Unable to complete request'}
              </p>
              <p className="text-xs text-red-700 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Real-time Farm Weather Forecast & 5-Day Advisory */}
        <WeatherForecast
          language={language}
          selectedCrop={selectedCrop}
          onAskWeatherQuestion={handleAskWeatherQuestion}
        />

        {/* Step 1: Crop Selection Cards */}
        <CropSelector
          language={language}
          selectedCrop={selectedCrop}
          onSelectCrop={handleSelectCrop}
        />

        {/* Step 2: Farming Question Box with Voice dictation */}
        <div ref={questionBoxRef}>
          <QuestionBox
            language={language}
            selectedCrop={selectedCrop}
            question={question}
            onQuestionChange={setQuestion}
            onSubmit={handleAskQuestion}
            isLoading={isLoading}
            onOpenDoctor={() => setIsDoctorOpen(true)}
          />
        </div>

        {/* Step 3: AI Answer Card */}
        {currentAnswer && (
          <div ref={answerSectionRef}>
            <AnswerCard
              language={language}
              question={currentAnswer.question}
              cropName={currentAnswer.cropName}
              answer={currentAnswer.answer}
              sources={currentAnswer.sources}
              onSpeak={handleSpeak}
              isSpeaking={isSpeaking}
              isLoadingAudio={isLoadingAudio}
              audioBase64={lastAudioBase64}
              onOpenExportView={handleOpenExportView}
              onFollowUp={(q) => {
                setQuestion(q);
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
            />
          </div>
        )}

        {/* Crop Doctor Modal for Leaf/Pest Photo Diagnosis */}
        <CropDoctor
          language={language}
          selectedCrop={selectedCrop}
          isOpen={isDoctorOpen}
          onClose={() => setIsDoctorOpen(false)}
          onSpeak={handleSpeak}
          isSpeaking={isSpeaking}
        />
      </main>

      {/* Informative Footer Banner */}
      <InfoBanner language={language} />

      {/* Visual Photo Studio Modal */}
      <VisualPhotoModal
        language={language}
        isOpen={isPhotoStudioOpen}
        onClose={() => setIsPhotoStudioOpen(false)}
        cropName={
          selectedCrop
            ? (language === 'ta'
                ? selectedCrop.nameTa
                : language === 'te'
                ? selectedCrop.nameTe
                : language === 'hi'
                ? selectedCrop.nameHi
                : selectedCrop.nameEn)
            : 'General Agriculture'
        }
        initialPrompt={question || (selectedCrop ? `${selectedCrop.nameEn} disease symptoms` : '')}
      />
    </div>
  );
}
