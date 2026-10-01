import React, { useState, useRef, useEffect } from 'react';
import { Crop } from '../data/crops';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  Camera,
  Upload,
  X,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  FileText,
  Download,
  Printer,
  FileCode,
  Check,
  ChevronDown,
  Link as LinkIcon,
} from 'lucide-react';
import {
  downloadTextFile,
  printHtmlViaIframe,
  generateDiagnosisReportHtml,
  triggerBlobDownload,
} from '../utils/downloadUtils';
import { buildExportUrl, ExportDiagnosisPayload } from '../utils/exportLinkUtils';
import { ExportLinkModal } from './ExportLinkModal';
import { VisualPhotoCard } from './VisualPhotoCard';
import { VisualPhotoModal, VisualPhotoData } from './VisualPhotoModal';

interface CropDoctorProps {
  language: Language;
  selectedCrop: Crop | null;
  isOpen: boolean;
  onClose: () => void;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
}

export const CropDoctor: React.FC<CropDoctorProps> = ({
  language,
  selectedCrop,
  isOpen,
  onClose,
  onSpeak,
  isSpeaking,
}) => {
  const t = TRANSLATIONS[language];
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [notes, setNotes] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [report, setReport] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [exportUrl, setExportUrl] = useState<string>('');
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState<boolean>(false);
  const [photoModalData, setPhotoModalData] = useState<VisualPhotoData | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDownloadOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

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

  const cropTitle = selectedCrop
    ? (language === 'ta'
        ? selectedCrop.nameTa
        : language === 'te'
        ? selectedCrop.nameTe
        : language === 'hi'
        ? selectedCrop.nameHi
        : selectedCrop.nameEn)
    : 'Crop';

  const cropSlug = cropTitle.toLowerCase().replace(/[^a-z0-9]+/g, '_');

  const handleGenerateExportLink = () => {
    if (!report) return;
    const payload: ExportDiagnosisPayload = {
      type: 'diagnosis',
      cropName: cropTitle,
      notes,
      report,
      language,
      timestamp: new Date().toISOString(),
    };
    const url = buildExportUrl(payload);
    setExportUrl(url);
    setIsExportModalOpen(true);
    setIsDownloadOpen(false);
  };

  const handleDownloadHtml = () => {
    if (!report) return;
    const html = generateDiagnosisReportHtml({
      cropName: cropTitle,
      notes,
      report,
      imageBase64,
      language,
    });
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const filename = `BhuMitra_Diagnosis_${cropSlug}_${getCleanDate()}.html`;
    triggerBlobDownload(blob, filename);
    setIsDownloadOpen(false);
    showNotification(`${filename} ${t.downloadSuccess}`);
  };

  const handlePrint = () => {
    if (!report) return;
    const html = generateDiagnosisReportHtml({
      cropName: cropTitle,
      notes,
      report,
      imageBase64,
      language,
    });
    printHtmlViaIframe(html);
    setIsDownloadOpen(false);
    showNotification(t.offlineReady);
  };

  const handleDownloadText = () => {
    if (!report) return;
    const divider = '==================================================';
    const isTa = language === 'ta';
    const isTe = language === 'te';
    const isHi = language === 'hi';
    const cropLabel = isTa ? 'பயிர்' : isTe ? 'పంట' : isHi ? 'फसल' : 'Crop';
    const dateLabel = isTa ? 'தேதி' : isTe ? 'తేదీ' : isHi ? 'दिनांक' : 'Date';
    const symptomsLabel = isTa ? 'அறிகுறிகள்' : isTe ? 'రైతు పేర్కొన్న లక్షణాలు' : isHi ? 'लक्षण' : 'Reported Symptoms';
    const prescriptionLabel = isTa
      ? 'மருத்துவ பரிசோதனை முடிவு & தீர்வுகள்'
      : isTe
      ? 'రోగనిర్ధారణ ఫలితాలు & చికిత్స ప్రిస్క్రిప్షన్'
      : isHi
      ? 'रोग निदान एवं उपचार नुस्खा (प्रिस्क्रिप्शन)'
      : 'DIAGNOSIS & TREATMENT PRESCRIPTION';

    let text = `${divider}\n`;
    text += `BHUMITRA CROP DOCTOR - PLANT PATHOLOGY PRESCRIPTION\n`;
    text += `${divider}\n\n`;
    text += `${cropLabel}: ${cropTitle}\n`;
    text += `${dateLabel}: ${new Date().toLocaleString()}\n`;
    if (notes) {
      text += `${symptomsLabel}: ${notes}\n`;
    }
    text += `\n${divider}\n`;
    text += `${prescriptionLabel}\n`;
    text += `${divider}\n\n`;
    text += `${report}\n\n`;
    text += `${divider}\n`;
    text += `SAFETY NOTICE: Follow manufacturer dosage strictly. Keep chemicals away from children.\n`;
    text += `${divider}\n`;

    const filename = `BhuMitra_Diagnosis_${cropSlug}_${getCleanDate()}.txt`;
    downloadTextFile(filename, text);
    setIsDownloadOpen(false);
    showNotification(`${filename} ${t.downloadSuccess}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage(
        language === 'ta'
          ? 'தயவுசெய்து புகைப்படத்தை மட்டும் தேர்வு செய்யவும்'
          : language === 'te'
          ? 'దయచేసి ఇమేజ్ ఫైల్‌ను మాత్రమే ఎంచుకోండి'
          : language === 'hi'
          ? 'कृपया केवल फोटो (इमेज) फाइल चुनें'
          : 'Please upload an image file'
      );
      return;
    }

    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = () => {
      setImageBase64(reader.result as string);
      setReport(null);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageBase64) {
      setErrorMessage(t.needQuestionOrPhoto);
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-crop-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          crop: selectedCrop ? cropTitle : 'General Crop',
          notes,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze crop photo');
      }

      setReport(data.report);
    } catch (err: any) {
      console.error('Crop image analysis error:', err);
      setErrorMessage(err.message || t.errorOccurred);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClearImage = () => {
    setImageBase64(null);
    setReport(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400 text-emerald-950 flex items-center justify-center shadow-md">
              <Camera className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                <span>{t.photoDiagnosisTitle}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-300 border border-lime-400/30">
                  Gemini 3.1 Pro
                </span>
              </h3>
              <p className="text-xs text-emerald-200">
                {selectedCrop ? (
                  <span>
                    {language === 'ta' ? 'ஆய்வு செய்யப்படும் பயிர்:' : 'Crop:'}{' '}
                    <strong>{language === 'ta' ? selectedCrop.nameTa : selectedCrop.nameEn}</strong>
                  </span>
                ) : (
                  <span>{t.photoDiagnosisDesc}</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-emerald-900/60 hover:bg-emerald-700 text-emerald-200 hover:text-white transition cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-stone-900">
          {/* Upload Area if no image */}
          {!imageBase64 ? (
            <div className="border-2 border-dashed border-emerald-400/70 rounded-2xl p-6 sm:p-8 text-center bg-emerald-50/30 hover:bg-emerald-50/60 transition flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 shadow-inner">
                <Upload className="w-8 h-8 stroke-[2]" />
              </div>
              <h4 className="font-bold text-stone-900 text-base mb-1">
                {t.uploadPhotoPrompt}
              </h4>
              <p className="text-xs sm:text-sm text-stone-600 max-w-sm mb-5">
                {t.snapOrUpload}
              </p>

              {/* Mobile Camera & File Pick buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {/* Take photo directly */}
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>{language === 'ta' ? 'கேமரா மூலம் படம் எடு' : 'Take Photo (Camera)'}</span>
                </button>

                {/* Choose from gallery */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm flex items-center gap-2 border border-stone-300 transition cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-stone-600" />
                  <span>{language === 'ta' ? 'கேலரியில் இருந்து தேர்வு' : 'Upload from Device'}</span>
                </button>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            /* Image Preview */
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-stone-300 bg-stone-100 flex items-center justify-center max-h-72">
                <img
                  src={imageBase64}
                  alt="Crop preview"
                  className="max-h-72 w-auto object-contain mx-auto"
                />
                <button
                  onClick={handleClearImage}
                  className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/80 hover:bg-stone-950 text-white transition shadow-md cursor-pointer"
                  title={t.removePhoto}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Extra symptoms text field */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ta' ? 'கூடுதல் அறிகுறிகள் (விருப்பப்பட்டால்):' : 'Additional Symptoms (Optional):'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.extraNotesPlaceholder}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Action Button */}
              {!report && (
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
                    isAnalyzing
                      ? 'bg-stone-300 text-stone-600 cursor-not-allowed'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20'
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t.analyzingImage}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-lime-300" />
                      <span>{t.analyzePhotoButton}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Diagnostic Result */}
          {report && (
            <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-300/80 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200/80">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <h4 className="font-extrabold text-stone-900 text-sm sm:text-base">
                    {language === 'ta' ? 'பயிர் பரிசோதனை முடிவு' : 'Diagnosis & Treatment Report'}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  {/* Download Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDownloadOpen((prev) => !prev)}
                      className="px-2.5 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-500 text-emerald-950 font-bold text-xs flex items-center gap-1.5 shadow-xs transition cursor-pointer"
                      title={t.downloadOptions}
                    >
                      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{t.download}</span>
                      <ChevronDown className={`w-3 h-3 transition-transform ${isDownloadOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isDownloadOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-40 animate-in fade-in duration-100">
                        <button
                          onClick={handleGenerateExportLink}
                          className="w-full text-left px-3 py-2 text-xs text-stone-800 hover:bg-emerald-50 hover:text-emerald-900 font-bold flex items-center gap-2 transition cursor-pointer border-b border-stone-100 bg-lime-50/50"
                        >
                          <LinkIcon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{t.generateExportLink}</span>
                        </button>
                        <button
                          onClick={handleDownloadHtml}
                          className="w-full text-left px-3 py-2 text-xs text-stone-800 hover:bg-emerald-50 hover:text-emerald-900 font-semibold flex items-center gap-2 transition cursor-pointer"
                        >
                          <FileCode className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{t.downloadPrescriptionHtml}</span>
                        </button>
                        <button
                          onClick={handlePrint}
                          className="w-full text-left px-3 py-2 text-xs text-stone-800 hover:bg-emerald-50 hover:text-emerald-900 font-semibold flex items-center gap-2 transition cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                          <span>{t.printDirect}</span>
                        </button>
                        <button
                          onClick={handleDownloadText}
                          className="w-full text-left px-3 py-2 text-xs text-stone-800 hover:bg-emerald-50 hover:text-emerald-900 font-semibold flex items-center gap-2 transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{t.downloadPrescriptionTxt}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Voice Readout Button */}
                  <button
                    onClick={() => onSpeak(report)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      isSpeaking
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                    }`}
                    title={isSpeaking ? t.stopVoice : t.listenVoice}
                  >
                    {isSpeaking ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>{t.stopVoice}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{t.listenVoice}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Download notification if active */}
              {downloadSuccessMsg && (
                <div className="p-2 px-3 rounded-lg bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{downloadSuccessMsg}</span>
                </div>
              )}

              {/* Formatted Report Content */}
              <div className="text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-wrap font-sans space-y-2 bg-white/70 p-3.5 rounded-xl border border-emerald-200/60">
                {report}
              </div>

              {/* Visual Demonstration Photo for Disease Diagnosis */}
              <VisualPhotoCard
                language={language}
                cropName={cropTitle}
                topic={`${cropTitle} crop disease diagnosis lesions and treatment demonstration`}
                contextText={report}
                onOpenFullModal={(data) => {
                  setPhotoModalData(data || null);
                  setIsPhotoModalOpen(true);
                }}
              />

              {/* Quick Action bar at bottom */}
              <div className="p-3 bg-white rounded-xl border border-emerald-200/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t.downloadDiagnosis}:</span>
                  </span>
                  <button
                    onClick={handleDownloadHtml}
                    className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                  >
                    <FileCode className="w-3 h-3 text-emerald-600" />
                    <span>PDF / HTML</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-2.5 py-1 rounded-md bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                  >
                    <Printer className="w-3 h-3 text-stone-600" />
                    <span>{t.printDirect}</span>
                  </button>
                  <button
                    onClick={handleDownloadText}
                    className="px-2.5 py-1 rounded-md bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3 text-amber-600" />
                    <span>.txt</span>
                  </button>
                  <button
                    onClick={handleGenerateExportLink}
                    className="px-2.5 py-1 rounded-md bg-lime-400 hover:bg-lime-500 text-emerald-950 text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
                    title={t.generateExportLink}
                  >
                    <LinkIcon className="w-3 h-3 text-emerald-950" />
                    <span>{t.exportLink}</span>
                  </button>
                </div>

                {/* Clear and Retest */}
                <button
                  onClick={handleClearImage}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1 cursor-pointer ml-auto"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>{language === 'ta' ? 'மற்றொரு படம்' : 'Test Another'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export Link Modal */}
      {report && (
        <ExportLinkModal
          language={language}
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          exportUrl={exportUrl}
          title={t.exportLinkModalTitle}
          cropName={cropTitle}
          questionOrSummary={notes || (language === 'ta' ? 'இலை நோய் பரிசோதனை' : 'Crop Disease Diagnosis')}
          fullContent={report}
          type="diagnosis"
        />
      )}

      {/* Visual Photo Studio Modal */}
      <VisualPhotoModal
        language={language}
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        cropName={cropTitle}
        initialPrompt={`${cropTitle} disease diagnosis symptoms`}
        initialContext={report || undefined}
        existingData={photoModalData}
      />
    </div>
  );
};
