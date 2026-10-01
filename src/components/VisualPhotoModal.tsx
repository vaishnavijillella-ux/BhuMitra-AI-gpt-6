import React, { useState } from 'react';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  Camera,
  X,
  Sparkles,
  Download,
  Share2,
  Check,
  Maximize2,
  Eye,
  ShieldCheck,
  RefreshCw,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { triggerBlobDownload } from '../utils/downloadUtils';

export interface VisualPhotoData {
  imageUrl: string;
  isLiveGenerated: boolean;
  visualTitle: string;
  whatToLookFor: string[];
  healthyVsDamaged?: string;
  practicalAdvice?: string;
  crop?: string;
}

interface VisualPhotoModalProps {
  language: Language;
  isOpen: boolean;
  onClose: () => void;
  cropName: string;
  initialPrompt?: string;
  initialContext?: string;
  existingData?: VisualPhotoData | null;
}

export const VisualPhotoModal: React.FC<VisualPhotoModalProps> = ({
  language,
  isOpen,
  onClose,
  cropName,
  initialPrompt = '',
  initialContext = '',
  existingData = null,
}) => {
  const t = TRANSLATIONS[language];
  const [prompt, setPrompt] = useState<string>(initialPrompt);
  const [photoData, setPhotoData] = useState<VisualPhotoData | null>(existingData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Sync if existing data was passed in
  React.useEffect(() => {
    if (existingData) {
      setPhotoData(existingData);
    }
  }, [existingData]);

  // Set prompt if initialPrompt changes
  React.useEffect(() => {
    if (initialPrompt && !prompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  if (!isOpen) return null;

  const handleGenerate = async (customPrompt?: string) => {
    const queryToUse = (customPrompt || prompt || cropName || 'Crop Field Care').trim();
    if (!queryToUse) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-farming-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryToUse,
          crop: cropName,
          language,
          context: initialContext,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate visual photo');
      }

      setPhotoData(data);
    } catch (err: any) {
      console.error('Visual photo error:', err);
      setErrorMessage(err.message || t.errorOccurred);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!photoData?.imageUrl) return;

    try {
      const res = await fetch(photoData.imageUrl);
      const blob = await res.blob();
      const safeTitle = (photoData.visualTitle || cropName || 'BhuMitra_Photo')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_');
      triggerBlobDownload(blob, `BhuMitra_${safeTitle}.jpg`);
    } catch (err) {
      console.error('Download image error:', err);
      // Fallback direct link download
      const a = document.createElement('a');
      a.href = photoData.imageUrl;
      a.download = `BhuMitra_${cropName || 'Photo'}.jpg`;
      a.click();
    }
  };

  const handleShare = () => {
    const textToCopy = `🌾 [BhuMitra AI - ${cropName}] Visual Field Guide: ${photoData?.visualTitle}\n\nIndicators:\n${photoData?.whatToLookFor?.map((w, i) => `${i + 1}. ${w}`).join('\n')}\n\n${photoData?.practicalAdvice || ''}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const quickPresets = [
    {
      titleEn: 'Leaf Blast Symptoms',
      titleTa: 'இலை கருகல் நோய் அறிகுறிகள்',
      titleTe: 'ఆకు మచ్చ తెగులు లక్షణాలు',
      titleHi: 'झुलसा रोग के लक्षण',
      prompt: 'Paddy blast disease spindle lesions on leaves close-up',
    },
    {
      titleEn: 'Drip Irrigation Setup',
      titleTa: 'சொட்டு நீர் பாசன அமைப்பு',
      titleTe: 'బిందు సేద్యం (డ్రిప్) ఏర్పాటు',
      titleHi: 'ड्रिप सिंचाई की सही विधि',
      prompt: 'Drip irrigation pipes and water droplets at plant roots in farm',
    },
    {
      titleEn: 'Organic Neem Spray',
      titleTa: 'இயற்கை வேப்பெண்ணெய் தெளிப்பு',
      titleTe: 'వేపనూనె పిచికారీ పద్ధతి',
      titleHi: 'नीम तेल का जैविक छिड़काव',
      prompt: 'Organic neem oil foliar spray application on crop leaves',
    },
    {
      titleEn: 'Nutrient Deficiency Signs',
      titleTa: 'ஊட்டச்சத்து குறைபாடு அறிகுறிகள்',
      titleTe: 'పోషక లోప లక్షణాలు',
      titleHi: 'पोषक तत्वों की कमी के लक्षण',
      prompt: 'Nitrogen deficiency leaf yellowing vs healthy green leaf',
    },
  ];

  const getPresetTitle = (preset: typeof quickPresets[0]) => {
    if (language === 'ta') return preset.titleTa;
    if (language === 'te') return preset.titleTe;
    if (language === 'hi') return preset.titleHi;
    return preset.titleEn;
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-green-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-400 text-emerald-950 flex items-center justify-center shadow-md">
              <Camera className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {t.visualPhotoStudio}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-lime-400/20 text-lime-300 text-[10px] font-bold uppercase tracking-wider border border-lime-400/30">
                  AI Photos
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                {t.visualPhotoStudioDesc}
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

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Search / Generate Input Bar */}
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'எந்த நோயின்/முறையின் விளக்கம் படம் வேண்டும்? (உதா: இலை கருகல் அறிகுறிகள்)'
                    : language === 'te'
                    ? 'ఏ తెగులు లేదా సాగు విధానం ఫోటో కావాలి? (ఉదా: ఆకు మచ్చ తెగులు)'
                    : language === 'hi'
                    ? 'किस रोग या विधि का स्पष्ट फोटो चाहिए? (उदा: झुलसा रोग लक्षण)'
                    : 'What crop symptom or technique do you want to see? (e.g. leaf blast spots)'
                }
                className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50 focus:bg-white transition"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleGenerate();
                }}
              />
              <button
                type="button"
                onClick={() => handleGenerate()}
                disabled={isLoading || !prompt.trim()}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer disabled:cursor-not-allowed shrink-0"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t.generatingPhoto}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-lime-300" />
                    <span>{t.generateVisualPhoto}</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Preset Topics */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
              <span className="text-stone-500 font-medium">
                {language === 'ta' ? 'விரைவு தேர்வுகள்:' : language === 'te' ? 'త్వరిత ఎంపికలు:' : language === 'hi' ? 'त्वरित विषय:' : 'Quick Examples:'}
              </span>
              {quickPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(preset.prompt);
                    handleGenerate(preset.prompt);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 border border-stone-200 text-stone-700 hover:text-emerald-900 font-medium transition cursor-pointer text-[11px]"
                >
                  {getPresetTitle(preset)}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center animate-pulse border border-emerald-200">
                <Camera className="w-6 h-6 animate-bounce" />
              </div>
              <h4 className="font-extrabold text-stone-900 text-sm sm:text-base">
                {t.generatingPhoto}
              </h4>
              <p className="text-xs text-stone-500 max-w-sm">
                {language === 'ta'
                  ? 'கள அறிகுறிகள் மற்றும் தெளிவான புகைப்பட வழிகாட்டலை AI உருவாக்குகிறது...'
                  : language === 'te'
                  ? 'AI స్పష్టమైన వ్యవసాయ ఫోటో మరియు వివరణాత్మక గైడ్‌ను సిద్ధం చేస్తోంది...'
                  : language === 'hi'
                  ? 'AI स्पष्ट खेत का फोटो और लक्षण मार्गदर्शिका तैयार कर रहा है...'
                  : 'AI is synthesizing high-clarity agricultural photography and visual pathology indicators...'}
              </p>
            </div>
          )}

          {/* Generated Photo & Guide Showcase */}
          {!isLoading && photoData && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Image Container with Actions */}
              <div className="relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-200 shadow-md group">
                <img
                  src={photoData.imageUrl}
                  alt={photoData.visualTitle || cropName}
                  referrerPolicy="no-referrer"
                  className={`w-full max-h-[380px] object-contain mx-auto bg-stone-950 transition-transform duration-300 ${
                    isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                />

                {/* Overlay Top Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-900/85 backdrop-blur-md text-emerald-100 text-xs font-bold border border-emerald-700/60 shadow-md flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                    <span>{photoData.crop || cropName}</span>
                  </span>
                  {photoData.isLiveGenerated && (
                    <span className="px-2.5 py-1 rounded-full bg-lime-400 text-emerald-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
                      Live AI Render
                    </span>
                  )}
                </div>

                {/* Overlay Floating Action Buttons */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsZoomed(!isZoomed)}
                    className="p-2 rounded-xl bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition cursor-pointer"
                    title={isZoomed ? 'Zoom Out' : 'Zoom In'}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadImage}
                    className="px-3 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-emerald-950 text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{t.downloadPhoto}</span>
                  </button>
                </div>
              </div>

              {/* Photo Title and Summary */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h4 className="font-extrabold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                    <Eye className="w-4 h-4 text-emerald-700" />
                    <span>{photoData.visualTitle}</span>
                  </h4>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
                  >
                    {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5 text-emerald-700" />}
                    <span>{copiedShare ? t.copied : t.shareWhatsApp}</span>
                  </button>
                </div>

                {/* Visual Indicators list */}
                {photoData.whatToLookFor && photoData.whatToLookFor.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider block mb-2">
                      {t.whatToLookFor}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {photoData.whatToLookFor.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-white border border-emerald-200/80 shadow-2xs flex items-start gap-2"
                        >
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-xs text-stone-700 leading-snug font-medium">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Healthy vs Damaged Comparison */}
                {photoData.healthyVsDamaged && (
                  <div className="mt-3 p-3 rounded-xl bg-white border border-emerald-200/80 text-xs text-stone-800 flex items-start gap-2">
                    <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-900 block mb-0.5">
                        {t.healthyVsDamaged}
                      </strong>
                      <p className="text-stone-600 leading-relaxed">
                        {photoData.healthyVsDamaged}
                      </p>
                    </div>
                  </div>
                )}

                {/* Practical Field Advice */}
                {photoData.practicalAdvice && (
                  <div className="mt-2 p-3 rounded-xl bg-lime-100/70 border border-lime-300 text-xs text-emerald-950 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block mb-0.5">
                        {language === 'ta' ? 'கள நடவடிக்கை வழிகாட்டல்:' : language === 'te' ? 'క్షేత్రస్థాయి కార్యాచరణ:' : language === 'hi' ? 'खेत में करने योग्य कार्य:' : 'Field Recommendation:'}
                      </strong>
                      <p className="text-emerald-900 leading-relaxed font-medium">
                        {photoData.practicalAdvice}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Initial Blank State (Before any photo is requested) */}
          {!isLoading && !photoData && (
            <div className="py-8 px-4 text-center border-2 border-dashed border-stone-200 rounded-2xl bg-stone-50">
              <Camera className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <h5 className="font-bold text-stone-700 text-sm">
                {language === 'ta'
                  ? 'விளக்கப் படத்தை உருவாக்க தலைப்பை தேர்வு செய்யவும்'
                  : language === 'te'
                  ? 'వివరణాత్మక ఫోటో కోసం పైన అంశాన్ని ఎంచుకోండి లేదా టైప్ చేయండి'
                  : language === 'hi'
                  ? 'स्पष्ट फोटो देखने के लिए ऊपर विषय चुनें या लिखें'
                  : 'Select an example above or enter any crop symptom to generate a visual photo'}
              </h5>
              <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                {language === 'ta'
                  ? 'பயிர் நோய்கள், இலை அறிகுறிகள் மற்றும் பாசன அமைப்புகளை புகைப்படத்துடன் தெளிவாக புரிந்து கொள்ளலாம்.'
                  : language === 'te'
                  ? 'పంట రోగాలు, ఆకు లక్షణాలు మరియు సాగు పద్ధతులను ఫోటోల ద్వారా సులభంగా అర్థం చేసుకోండి.'
                  : language === 'hi'
                  ? 'फसल की बीमारी, पत्ती के लक्षण और खेती की विधियों को वास्तविक फोटो से स्पष्ट समझें।'
                  : 'High-resolution photographs and visual pathology indicators helping farmers identify diseases and techniques clearly.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
