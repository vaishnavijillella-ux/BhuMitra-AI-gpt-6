import React, { useState } from 'react';
import { ExportPayload } from '../utils/exportLinkUtils';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  Download,
  Printer,
  FileText,
  FileCode,
  Share2,
  Copy,
  Check,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Leaf,
  Calendar,
  Sparkles,
} from 'lucide-react';
import {
  downloadTextFile,
  printHtmlViaIframe,
  generateAdvisoryReportHtml,
  generateDiagnosisReportHtml,
  triggerBlobDownload,
} from '../utils/downloadUtils';

interface ExportViewProps {
  payload: ExportPayload;
  onBackToApp: () => void;
  language: Language;
}

export const ExportView: React.FC<ExportViewProps> = ({ payload, onBackToApp, language }) => {
  const t = TRANSLATIONS[language];
  const [copied, setCopied] = useState<boolean>(false);
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  const isTa = language === 'ta';
  const isTe = language === 'te';
  const isHi = language === 'hi';

  const cropName =
    payload.type === 'weather'
      ? payload.cropName || payload.locationName
      : payload.cropName || 'Agriculture';

  const getReturnText = () => {
    if (isTa) return '← முதன்மை பயன்பாட்டிற்குத் திரும்பு';
    if (isTe) return '← ప్రధాన యాప్‌కి తిరిగి వెళ్ళండి';
    if (isHi) return '← मुख्य ऐप पर वापस जाएं';
    return '← Return to Full BhuMitra App';
  };

  const getDocSubtitle = () => {
    if (isTa) return 'வேளாண் விஞ்ஞான ஆலோசனை அறிக்கை';
    if (isTe) return 'అధికారిక వ్యవసాయ శాస్త్ర సలహా నివేదిక';
    if (isHi) return 'आधिकारिक कृषि वैज्ञानिक सलाह रिपोर्ट';
    return 'Official Agricultural Advisory & Prescription';
  };

  const getExportBadge = () => {
    if (isTa) return 'ஏற்றுமதி செய்யப்பட்ட ஆவணம்';
    if (isTe) return 'ఎగుమతి చేయబడిన పత్రం';
    if (isHi) return 'निर्यात किया गया दस्तावेज';
    return 'Permanent Export Link';
  };

  const getCropLabel = () => {
    if (isTa) return 'பயிர்';
    if (isTe) return 'పంట';
    if (isHi) return 'फसल';
    return 'Target Crop';
  };

  const getStatusLabel = () => {
    if (isTa) return 'நிலை';
    if (isTe) return 'స్థితి';
    if (isHi) return 'स्थिति';
    return 'Status';
  };

  const getVerifiedText = () => {
    if (isTa) return 'சரிபார்க்கப்பட்ட ஆலோசனை';
    if (isTe) return 'ధృవీకరించబడిన వ్యవసాయ మార్గదర్శకత్వం';
    if (isHi) return 'प्रमाणित कृषि मार्गदर्शन';
    return 'Verified Agricultural Guidance';
  };

  const getQuestionTitle = () => {
    if (isTa) return 'விவசாயியின் கேள்வி:';
    if (isTe) return 'రైతు ప్రశ్న:';
    if (isHi) return 'किसान का प्रश्न:';
    return "Farmer's Question:";
  };

  const getSymptomsTitle = () => {
    if (isTa) return 'விவசாயி குறிப்பிட்ட அறிகுறிகள்:';
    if (isTe) return 'రైతు గమనించిన లక్షణాలు:';
    if (isHi) return 'किसान द्वारा देखे गए लक्षण:';
    return "Farmer's Observed Symptoms:";
  };

  const getSourcesTitle = () => {
    if (isTa) return 'சரிபார்க்கப்பட்ட வேளாண் ஆதாரங்கள்:';
    if (isTe) return 'ధృవీకరించబడిన వ్యవసాయ మూలాలు:';
    if (isHi) return 'प्रमाणित कृषि संदर्भ:';
    return 'Verified Agricultural Sources:';
  };

  const handleCopyText = () => {
    let textToCopy = '';
    if (payload.type === 'advisory') {
      textToCopy = `[BhuMitra AI - ${cropName}]\nQuestion: ${payload.question}\n\n${payload.answer}`;
    } else if (payload.type === 'diagnosis') {
      textToCopy = `[BhuMitra Crop Doctor - ${cropName}]\nDiagnosis Report:\n\n${payload.report}`;
    } else if (payload.type === 'weather') {
      textToCopy = `[BhuMitra AI Weather - ${payload.locationName}]\nTemp: ${payload.temperature}°C (${payload.condition})\nSpray: ${payload.sprayAdvisory}\nIrrigation: ${payload.irrigationAdvisory}`;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    if (payload.type === 'advisory') {
      const html = generateAdvisoryReportHtml({
        cropName,
        question: payload.question,
        answer: payload.answer,
        sources: payload.sources,
        language,
      });
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      triggerBlobDownload(blob, `BhuMitra_Export_${cropName.replace(/\s+/g, '_')}.html`);
    } else if (payload.type === 'diagnosis') {
      const html = generateDiagnosisReportHtml({
        cropName,
        notes: payload.notes,
        report: payload.report,
        language,
      });
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      triggerBlobDownload(blob, `BhuMitra_Prescription_${cropName.replace(/\s+/g, '_')}.html`);
    }
  };

  const handlePrint = () => {
    if (payload.type === 'advisory') {
      const html = generateAdvisoryReportHtml({
        cropName,
        question: payload.question,
        answer: payload.answer,
        sources: payload.sources,
        language,
      });
      printHtmlViaIframe(html);
    } else if (payload.type === 'diagnosis') {
      const html = generateDiagnosisReportHtml({
        cropName,
        notes: payload.notes,
        report: payload.report,
        language,
      });
      printHtmlViaIframe(html);
    }
  };

  const handleDownloadText = () => {
    let content = '';
    if (payload.type === 'advisory') {
      content = `BHUMITRA AI - EXPORTED ADVISORY\nCrop: ${cropName}\nQuestion: "${payload.question}"\n\n${payload.answer}`;
    } else if (payload.type === 'diagnosis') {
      content = `BHUMITRA CROP DOCTOR - EXPORTED PRESCRIPTION\nCrop: ${cropName}\n\n${payload.report}`;
    } else if (payload.type === 'weather') {
      content = `BHUMITRA FARM WEATHER - ${payload.locationName}\nTemp: ${payload.temperature}°C\nCondition: ${payload.condition}\nSpraying: ${payload.sprayAdvisory}\nIrrigation: ${payload.irrigationAdvisory}`;
    }
    downloadTextFile(`BhuMitra_Export_${cropName.replace(/\s+/g, '_')}.txt`, content);
  };

  const getContentBody = () => {
    if (payload.type === 'advisory') return payload.answer;
    if (payload.type === 'diagnosis') return payload.report;
    if (payload.type === 'weather') {
      return `District: ${payload.locationName}\nTemperature: ${payload.temperature}°C (${payload.condition})\nHumidity: ${payload.humidity}%\nWind Speed: ${payload.windSpeed} km/h\nRain Probability: ${payload.rainChance}%\n\nSpraying Window: ${payload.sprayAdvisory}\nIrrigation Advice: ${payload.irrigationAdvisory}`;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-stone-100 py-6 px-4 sm:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
          <button
            onClick={onBackToApp}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-800 hover:text-emerald-950 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{getReturnText()}</span>
          </button>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.downloadPdf}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
              <span>{t.printDirect}</span>
            </button>
            <button
              onClick={handleDownloadText}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-stone-600" />
              <span>{t.downloadTxt}</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-lime-400 hover:bg-lime-500 text-emerald-950 text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer"
            >
              {linkCopied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{linkCopied ? t.copied : t.generateExportLink}</span>
            </button>
          </div>
        </div>

        {/* Main Document Body */}
        <article className="bg-white rounded-3xl p-6 sm:p-10 shadow-md border border-stone-200 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-emerald-500">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-md">
                <Leaf className="w-6 h-6 text-lime-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
                  BhuMitra AI
                </h1>
                <p className="text-xs sm:text-sm text-emerald-700 font-semibold">
                  {getDocSubtitle()}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider border border-emerald-200">
                {getExportBadge()}
              </span>
              <p className="text-xs text-stone-500 mt-1">
                {new Date().toLocaleDateString(
                  isTa ? 'ta-IN' : isTe ? 'te-IN' : isHi ? 'hi-IN' : 'en-IN',
                  { dateStyle: 'full' }
                )}
              </p>
            </div>
          </div>

          {/* Metadata Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm">
            <div>
              <span className="text-stone-500 block text-xs">{getCropLabel()}:</span>
              <strong className="text-emerald-900 text-base">{cropName}</strong>
            </div>
            <div>
              <span className="text-stone-500 block text-xs">{getStatusLabel()}:</span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                {getVerifiedText()}
              </span>
            </div>
          </div>

          {/* Farmer Question */}
          {payload.type === 'advisory' && payload.question && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border-l-4 border-amber-500 text-stone-800">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                {getQuestionTitle()}
              </div>
              <p className="font-semibold italic text-stone-900 text-sm sm:text-base">
                "{payload.question}"
              </p>
            </div>
          )}

          {payload.type === 'diagnosis' && payload.notes && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border-l-4 border-amber-500 text-stone-800">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1">
                {getSymptomsTitle()}
              </div>
              <p className="font-semibold italic text-stone-900 text-sm sm:text-base">
                "{payload.notes}"
              </p>
            </div>
          )}

          {/* Content Body */}
          <div className="space-y-4 text-stone-800 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-sans">
            {getContentBody()}
          </div>

          {/* Sources if present */}
          {payload.type === 'advisory' && payload.sources && payload.sources.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-900 mb-2">
                {getSourcesTitle()}
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-800">
                {payload.sources.map((src, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <a
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-emerald-950 font-medium truncate"
                    >
                      {src.title || src.uri}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Disclaimer */}
          <div className="pt-6 border-t border-stone-200 flex items-start gap-2 text-xs text-stone-500">
            <AlertCircle className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <p>
              {t.disclaimer}
            </p>
          </div>
        </article>
      </div>
    </div>
  );
};
