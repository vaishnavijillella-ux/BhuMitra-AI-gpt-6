import React, { useState, useRef, useEffect } from 'react';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  Volume2,
  VolumeX,
  Copy,
  Check,
  ExternalLink,
  Search,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  AlertCircle,
  Download,
  FileText,
  Printer,
  FileCode,
  Music,
  ChevronDown,
  Loader2,
  Link as LinkIcon,
  Share2,
  Camera,
} from 'lucide-react';
import {
  downloadTextFile,
  downloadAudioBase64,
  printHtmlViaIframe,
  generateAdvisoryReportHtml,
  triggerBlobDownload,
} from '../utils/downloadUtils';
import { buildExportUrl, ExportAdvisoryPayload, ExportPayload } from '../utils/exportLinkUtils';
import { ExportLinkModal } from './ExportLinkModal';
import { VisualPhotoCard } from './VisualPhotoCard';
import { VisualPhotoModal, VisualPhotoData } from './VisualPhotoModal';

interface AnswerSource {
  title: string;
  uri: string;
}

interface AnswerCardProps {
  language: Language;
  question: string;
  cropName: string;
  answer: string;
  sources: AnswerSource[];
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  isLoadingAudio: boolean;
  onFollowUp: (q: string) => void;
  audioBase64?: string | null;
  onOpenExportView?: (payload: ExportPayload) => void;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  language,
  question,
  cropName,
  answer,
  sources,
  onSpeak,
  isSpeaking,
  isLoadingAudio,
  onFollowUp,
  audioBase64,
  onOpenExportView,
}) => {
  const t = TRANSLATIONS[language];
  const [copied, setCopied] = useState<boolean>(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [isDownloadingAudio, setIsDownloadingAudio] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportUrl, setExportUrl] = useState<string>('');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [photoModalData, setPhotoModalData] = useState<VisualPhotoData | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDownloadOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getAdvisoryPayload = (): ExportAdvisoryPayload => ({
    type: 'advisory',
    cropName: cropName || 'General Agriculture',
    question,
    answer,
    sources,
    language,
    timestamp: new Date().toISOString(),
  });

  const handleGenerateExportLink = () => {
    const payload = getAdvisoryPayload();
    const url = buildExportUrl(payload);
    setExportUrl(url);
    setIsExportModalOpen(true);
    setIsDownloadOpen(false);
  };

  const showNotification = (msg: string) => {
    setDownloadSuccessMsg(msg);
    setTimeout(() => {
      setDownloadSuccessMsg(null);
    }, 3500);
  };

  const getCleanDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getSafeCropSlug = () => {
    return (cropName || 'Agriculture').toLowerCase().replace(/[^a-z0-9]+/g, '_');
  };

  // Download 1: Formatted PDF-ready HTML Document
  const handleDownloadHtmlReport = () => {
    const html = generateAdvisoryReportHtml({
      cropName,
      question,
      answer,
      sources,
      language,
    });
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const filename = `BhuMitra_Advisory_${getSafeCropSlug()}_${getCleanDate()}.html`;
    triggerBlobDownload(blob, filename);
    setIsDownloadOpen(false);
    showNotification(`${filename} ${t.downloadSuccess}`);
  };

  // Download 2: Direct Print / Save as PDF
  const handlePrintReport = () => {
    const html = generateAdvisoryReportHtml({
      cropName,
      question,
      answer,
      sources,
      language,
    });
    printHtmlViaIframe(html);
    setIsDownloadOpen(false);
    showNotification(t.offlineReady);
  };

  // Download 3: Clean Plain Text File (.txt)
  const handleDownloadTextFile = () => {
    const divider = '==================================================';
    const isTa = language === 'ta';
    const isTe = language === 'te';
    const isHi = language === 'hi';

    let text = `${divider}\n`;
    text += `BHUMITRA AI - FARMER ADVISORY REPORT\n`;
    text += `${divider}\n\n`;
    text += `${isTa ? 'பயிர்' : isTe ? 'పంట' : isHi ? 'फसल' : 'Crop'}: ${cropName}\n`;
    text += `${isTa ? 'தேதி' : isTe ? 'తేదీ' : isHi ? 'तारीख' : 'Date'}: ${new Date().toLocaleString()}\n`;
    text += `${isTa ? 'விவசாயியின் கேள்வி' : isTe ? 'రైతు ప్రశ్న' : isHi ? 'किसान का प्रश्न' : "Farmer's Query"}: "${question}"\n\n`;
    text += `${divider}\n`;
    text += `${isTa ? 'அறிவியல் ஆலோசனை & தீர்வு' : isTe ? 'శాస్త్రీయ వ్యవసాయ సలహా మరియు సిఫార్సులు' : isHi ? 'वैज्ञानिक कृषि सलाह एवं समाधान' : 'AGRICULTURAL ADVICE & RECOMMENDATIONS'}\n`;
    text += `${divider}\n\n`;
    text += `${answer}\n\n`;

    if (sources && sources.length > 0) {
      text += `${divider}\n`;
      text += `${isTa ? 'சரிபார்க்கப்பட்ட ஆதாரங்கள்' : isTe ? 'ధృవీకరించబడిన మూలాలు' : isHi ? 'प्रमाणित संदर्भ' : 'VERIFIED SOURCES'}\n`;
      text += `${divider}\n`;
      sources.forEach((s, idx) => {
        text += `${idx + 1}. ${s.title}: ${s.uri}\n`;
      });
      text += '\n';
    }

    text += `${divider}\n`;
    text += `DISCLAIMER: ${t.disclaimer}\n`;
    text += `${divider}\n`;

    const filename = `BhuMitra_Advisory_${getSafeCropSlug()}_${getCleanDate()}.txt`;
    downloadTextFile(filename, text);
    setIsDownloadOpen(false);
    showNotification(`${filename} ${t.downloadSuccess}`);
  };

  // Download 4: Voice Note (.wav)
  const handleDownloadAudio = async () => {
    setIsDownloadingAudio(true);
    try {
      let b64 = audioBase64;
      if (!b64) {
        // Fetch audio if not cached yet
        const response = await fetch('/api/text-to-speech', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: answer,
            language,
          }),
        });
        const data = await response.json();
        if (!response.ok || !data.audioBase64) {
          throw new Error(data.error || 'Failed to generate voice audio');
        }
        b64 = data.audioBase64;
      }

      if (b64) {
        const filename = `BhuMitra_Voice_${getSafeCropSlug()}_${getCleanDate()}.wav`;
        downloadAudioBase64(filename, b64, 'audio/wav');
        showNotification(`${filename} ${t.downloadSuccess}`);
      }
    } catch (err: any) {
      console.error('Audio download error:', err);
      showNotification(
        language === 'ta'
          ? 'குரல் பதிவிறக்கம் செய்ய முடியவில்லை'
          : language === 'te'
          ? 'ఆడియో డౌన్‌లోడ్ చేయడంలో విఫలమైంది'
          : language === 'hi'
          ? 'ऑडियो डाउनलोड करने में विफल'
          : 'Could not download voice note'
      );
    } finally {
      setIsDownloadingAudio(false);
      setIsDownloadOpen(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${cropName ? `[${cropName}] ` : ''}Q: ${question}\n\n${answer}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to format markdown text simply for clear readability
  const renderFormattedAnswer = (text: string) => {
    // Split by paragraphs
    const paragraphs = text.split('\n');

    return (
      <div className="space-y-3 text-stone-800 leading-relaxed text-sm sm:text-base">
        {paragraphs.map((para, idx) => {
          const trimmed = para.trim();
          if (!trimmed) return null;

          // Headings
          if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
            const headingText = trimmed.replace(/^#+\s*/, '');
            return (
              <h4 key={idx} className="font-extrabold text-base sm:text-lg text-emerald-950 mt-4 first:mt-0 flex items-center gap-1.5 border-b border-emerald-100 pb-1">
                <span>{headingText}</span>
              </h4>
            );
          }

          // Bullet points
          if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
            const bulletText = trimmed.replace(/^[*•-]\s*/, '');
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-2 shrink-0"></span>
                <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatBold(bulletText) }} />
              </div>
            );
          }

          // Numbered lists (e.g. 1. 2.)
          if (/^\d+\.\s/.test(trimmed)) {
            const match = trimmed.match(/^(\d+\.)\s*(.*)$/);
            if (match) {
              return (
                <div key={idx} className="flex items-start gap-2.5 pl-2">
                  <span className="font-bold text-emerald-800 shrink-0 text-xs sm:text-sm mt-0.5">
                    {match[1]}
                  </span>
                  <span className="flex-1" dangerouslySetInnerHTML={{ __html: formatBold(match[2]) }} />
                </div>
              );
            }
          }

          // Regular paragraph
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatBold(trimmed) }} />
          );
        })}
      </div>
    );
  };

  // Replace **bold** with <strong>
  const formatBold = (str: string) => {
    return str.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-stone-900">$1</strong>');
  };

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 shadow-md border-2 border-emerald-500/30 overflow-hidden relative">
      {/* Top Banner & Audio Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold">
              3
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-stone-900">
              {t.answerSectionTitle}
            </h3>
          </div>
          <p className="text-xs text-stone-600 mt-0.5 pl-9 flex items-center gap-1.5">
            <span>
              {language === 'ta'
                ? 'கேள்வி:'
                : language === 'te'
                ? 'ప్రశ్న:'
                : language === 'hi'
                ? 'प्रश्न:'
                : 'Question:'}
            </span>
            <span className="font-medium text-stone-900 italic line-clamp-1">
              "{question}"
            </span>
          </p>
        </div>

        {/* Action Controls: Voice Speech & Copy */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {/* Audio TTS Button */}
          <button
            onClick={() => onSpeak(answer)}
            disabled={isLoadingAudio}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
              isSpeaking
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : isLoadingAudio
                ? 'bg-stone-200 text-stone-500 cursor-wait'
                : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20'
            }`}
            title={isSpeaking ? t.stopVoice : t.listenVoice}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>{t.stopVoice}</span>
                {/* Waveform indicator */}
                <span className="flex items-center gap-0.5 h-3 ml-1">
                  <span className="w-1 h-3 bg-white rounded-full animate-bounce [animation-delay:0ms]"></span>
                  <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:150ms]"></span>
                  <span className="w-1 h-3.5 bg-white rounded-full animate-bounce [animation-delay:300ms]"></span>
                </span>
              </>
            ) : isLoadingAudio ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-stone-500 border-t-transparent rounded-full animate-spin" />
                <span>{t.generatingVoice}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-lime-300" />
                <span>{t.listenVoice}</span>
              </>
            )}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-2 sm:px-3 sm:py-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer"
            title={t.copyAnswer}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline text-emerald-700">{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-500" />
                <span className="hidden sm:inline">{t.copyAnswer}</span>
              </>
            )}
          </button>

          {/* Generate Visual Photo Button */}
          <button
            onClick={() => {
              setPhotoModalData(null);
              setIsPhotoModalOpen(true);
            }}
            className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            title={t.generateVisualPhoto}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">{t.generateVisualPhoto}</span>
            <span className="sm:hidden">{language === 'ta' ? 'படம்' : language === 'te' ? 'ఫోటో' : language === 'hi' ? 'फोटो' : 'Photo'}</span>
          </button>

          {/* Generate Export Link Button */}
          <button
            onClick={handleGenerateExportLink}
            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            title={t.generateExportLink}
          >
            <LinkIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">{t.generateExportLink}</span>
            <span className="sm:hidden">{t.exportLink}</span>
          </button>

          {/* Download Dropdown Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDownloadOpen((prev) => !prev)}
              className="px-3 py-2 rounded-xl bg-lime-500 hover:bg-lime-600 text-emerald-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition cursor-pointer border border-lime-400"
              title={t.downloadOptions}
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span className="font-extrabold">{t.download}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDownloadOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDownloadOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-600 border-b border-stone-100">
                  {t.downloadOptions}
                </div>

                {/* Option 0: Generate Shareable Link to Export */}
                <button
                  onClick={handleGenerateExportLink}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-stone-800 hover:bg-emerald-50 hover:text-emerald-900 font-bold flex items-center gap-2.5 transition cursor-pointer border-b border-stone-100 bg-lime-50/50"
                >
                  <LinkIcon className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div className="flex-1">
                    <div className="text-emerald-900">{t.generateExportLink}</div>
                    <div className="text-[10px] text-stone-500 font-normal">
                      {language === 'ta'
                        ? 'வாட்ஸ்அப், அச்சு & பார்வைக்கு நேரடி இணைப்பு'
                        : language === 'te'
                        ? 'వాట్సాప్, ప్రింట్ మరియు ఫీల్డ్ వ్యూ కోసం లింక్'
                        : language === 'hi'
                        ? 'व्हाट्सएप, प्रिंट और फील्ड व्यू के लिए लिंक'
                        : 'Shareable link for WhatsApp & field view'}
                    </div>
                  </div>
                </button>

                {/* Option 1: PDF / Printable Report */}
                <button
                  onClick={handleDownloadHtmlReport}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-stone-800 hover:bg-emerald-50 hover:text-emerald-900 font-semibold flex items-center gap-2.5 transition cursor-pointer"
                >
                  <FileCode className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="flex-1">
                    <div>{t.downloadPdf}</div>
                    <div className="text-[10px] text-stone-600 font-normal">
                      {language === 'ta'
                        ? 'அனைத்து உலாவிகளிலும் ஆஃப்லைனில் படிக்கலாம்'
                        : language === 'te'
                        ? 'బ్రౌజర్లలో ఆఫ్‌లైన్‌లో చదువుకోవచ్చు'
                        : language === 'hi'
                        ? 'ऑफ़लाइन पढ़ने हेतु तैयार दस्तावेज़'
                        : 'Offline ready document'}
                    </div>
                  </div>
                </button>

                {/* Option 2: Direct Print / PDF Save */}
                <button
                  onClick={handlePrintReport}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-stone-800 hover:bg-emerald-50 hover:text-emerald-900 font-semibold flex items-center gap-2.5 transition cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div className="flex-1">
                    <div>{t.printDirect}</div>
                    <div className="text-[10px] text-stone-600 font-normal">
                      {language === 'ta'
                        ? 'உடனடி அச்சு அல்லது PDF சேமிப்பு'
                        : language === 'te'
                        ? 'నేరుగా ప్రింట్ లేదా PDF లో భద్రపరచుకోండి'
                        : language === 'hi'
                        ? 'सीधे प्रिंट या PDF के रूप में सहेजें'
                        : 'Direct 1-click print dialog'}
                    </div>
                  </div>
                </button>

                {/* Option 3: Text Document */}
                <button
                  onClick={handleDownloadTextFile}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-stone-800 hover:bg-emerald-50 hover:text-emerald-900 font-semibold flex items-center gap-2.5 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="flex-1">
                    <div>{t.downloadTxt}</div>
                    <div className="text-[10px] text-stone-600 font-normal">
                      {language === 'ta'
                        ? 'வாட்ஸ்அப் மற்றும் எளிய வாசிப்புக்கு'
                        : language === 'te'
                        ? 'వాట్సాప్ మరియు సాధారణ పఠనానికి'
                        : language === 'hi'
                        ? 'एसएमएस एवं व्हाट्सएप हेतु सरल टेक्स्ट'
                        : 'Lightweight text for SMS & WhatsApp'}
                    </div>
                  </div>
                </button>

                {/* Option 4: Audio WAV */}
                <button
                  onClick={handleDownloadAudio}
                  disabled={isDownloadingAudio}
                  className="w-full text-left px-3.5 py-2.5 text-xs text-stone-800 hover:bg-emerald-50 hover:text-emerald-900 font-semibold flex items-center gap-2.5 transition cursor-pointer border-t border-stone-100"
                >
                  {isDownloadingAudio ? (
                    <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
                  ) : (
                    <Music className="w-4 h-4 text-lime-600 shrink-0" />
                  )}
                  <div className="flex-1">
                    <div>{t.downloadAudio}</div>
                    <div className="text-[10px] text-stone-600 font-normal">
                      {isDownloadingAudio
                        ? language === 'ta'
                          ? 'குரல் தயாராகிறது...'
                          : language === 'te'
                          ? 'వాయిస్ సిద్ధమవుతోంది...'
                          : language === 'hi'
                          ? 'आवाज तैयार हो रही है...'
                          : 'Preparing audio...'
                        : language === 'ta'
                        ? 'பண்ணையில் ஆஃப்லைனில் கேட்க'
                        : language === 'te'
                        ? 'పొలంలో ఆఫ్‌లైన్‌లో వినడానికి'
                        : language === 'hi'
                        ? 'खेत में ऑफ़लाइन सुनने हेतु'
                        : 'Listen offline in your field'}
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Download Success Toast Message if active */}
      {downloadSuccessMsg && (
        <div className="mb-4 p-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{downloadSuccessMsg}</span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
            {t.offlineReady}
          </span>
        </div>
      )}

      {/* Google Search Grounding Badge */}
      <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
        <Search className="w-3.5 h-3.5 text-blue-600" />
        <span>{t.searchGroundingBadge}</span>
      </div>

      {/* Answer Body */}
      <div className="bg-emerald-50/20 p-4 sm:p-5 rounded-2xl border border-emerald-100/70">
        {renderFormattedAnswer(answer)}
      </div>

      {/* Visual Demonstration Photo & Indicators */}
      <VisualPhotoCard
        language={language}
        cropName={cropName}
        topic={question}
        contextText={answer}
        onOpenFullModal={(data) => {
          setPhotoModalData(data || null);
          setIsPhotoModalOpen(true);
        }}
      />

      {/* Google Search Sources list if available */}
      {sources && sources.length > 0 && (
        <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-2 text-xs font-bold text-stone-800 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{t.verifiedSources}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sources.map((source, idx) => (
              <a
                key={idx}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-xs text-stone-700 hover:text-emerald-900 transition group"
              >
                <span className="truncate font-medium">{source.title}</span>
                <ExternalLink className="w-3 h-3 text-stone-400 group-hover:text-emerald-700 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Quick Download & Field Offline Tools */}
      <div className="mt-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-lime-50/50 to-stone-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-emerald-950">
              {language === 'ta' ? 'பண்ணை பயன்பாட்டிற்கு பதிவிறக்கவும்' : 'Save & Download for Field Use'}
            </h4>
            <p className="text-[11px] text-stone-600">
              {language === 'ta' ? 'இணையம் இல்லாதபோதும் ஆஃப்லைனில் படிக்கலாம்' : 'Access this advisory offline without internet in your fields'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDownloadHtmlReport}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            title={t.downloadPdf}
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.downloadPdf}</span>
          </button>
          <button
            onClick={handlePrintReport}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            title={t.printDirect}
          >
            <Printer className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.printDirect}</span>
          </button>
          <button
            onClick={handleDownloadTextFile}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-amber-100/80 border border-stone-300 text-stone-800 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            title={t.downloadTxt}
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.downloadTxt}</span>
          </button>
          <button
            onClick={handleGenerateExportLink}
            className="px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-500 border border-lime-500 text-emerald-950 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
            title={t.generateExportLink}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{t.generateExportLink}</span>
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 flex items-start gap-2 text-[11px] text-stone-500 leading-normal">
        <AlertCircle className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
        <span>{t.disclaimer}</span>
      </div>

      {/* Export Link Modal */}
      <ExportLinkModal
        language={language}
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        exportUrl={exportUrl}
        title={t.exportLinkModalTitle}
        cropName={cropName || 'Agriculture'}
        questionOrSummary={question}
        fullContent={answer}
        sources={sources}
        type="advisory"
        onOpenExportView={
          onOpenExportView ? () => onOpenExportView(getAdvisoryPayload()) : undefined
        }
      />

      {/* Visual Photo Studio Modal */}
      <VisualPhotoModal
        language={language}
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        cropName={cropName || 'Agriculture'}
        initialPrompt={question}
        initialContext={answer}
        existingData={photoModalData}
      />
    </section>
  );
};
