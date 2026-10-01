import React, { useState } from 'react';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  Camera,
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
  ExternalLink,
} from 'lucide-react';
import { triggerBlobDownload } from '../utils/downloadUtils';
import { VisualPhotoData } from './VisualPhotoModal';

interface VisualPhotoCardProps {
  language: Language;
  cropName: string;
  topic: string;
  contextText?: string;
  onOpenFullModal?: (photoData?: VisualPhotoData) => void;
}

export const VisualPhotoCard: React.FC<VisualPhotoCardProps> = ({
  language,
  cropName,
  topic,
  contextText = '',
  onOpenFullModal,
}) => {
  const t = TRANSLATIONS[language];
  const [photoData, setPhotoData] = useState<VisualPhotoData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-farming-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: topic || cropName,
          crop: cropName,
          language,
          context: contextText,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate visual photo');
      }

      setPhotoData(data);
    } catch (err: any) {
      console.error('Visual photo card error:', err);
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

  return (
    <div className="mt-4 rounded-2xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/50 via-white to-stone-50 p-4 sm:p-5 shadow-2xs">
      {/* Top Header of the Visual Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-emerald-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
            <Camera className="w-4 h-4 text-lime-300" />
          </div>
          <div>
            <h4 className="font-extrabold text-stone-900 text-sm sm:text-base flex items-center gap-2">
              <span>{t.visualGuideTitle}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-lime-400/30 text-emerald-950 px-2 py-0.5 rounded-full border border-lime-400/40">
                Visual Photo
              </span>
            </h4>
            <p className="text-xs text-stone-600">
              {t.visualGuideSubtitle}
            </p>
          </div>
        </div>

        {/* Action Button: Generate or Full View */}
        <div className="flex items-center gap-2">
          {!photoData ? (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-xs cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{t.generatingPhoto}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-lime-300" />
                  <span>{t.generateVisualPhoto}</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onOpenFullModal?.(photoData)}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 border border-stone-200 text-stone-700 hover:text-emerald-900 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
              <span>{language === 'ta' ? 'பெரிதாக்க' : language === 'te' ? 'పెద్దదిగా చూడండి' : language === 'hi' ? 'बड़ा देखें' : 'Expand View'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Message if any */}
      {errorMessage && (
        <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          {errorMessage}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
          <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
          <p className="text-xs font-semibold text-stone-700">
            {t.generatingPhoto}
          </p>
          <span className="text-[11px] text-stone-500">
            {language === 'ta'
              ? 'விளக்கப் புகைப்படம் மற்றும் கள அறிகுறிகள் தொகுக்கப்படுகிறது...'
              : language === 'te'
              ? 'స్పష్టమైన వ్యవసాయ ఫోటో మరియు లక్షణాలు రూపొందించబడుతున్నాయి...'
              : language === 'hi'
              ? 'स्पष्ट फोटो और फील्ड लक्षण तैयार किए जा रहे हैं...'
              : 'Synthesizing visual agricultural photography & symptom indicators...'}
          </span>
        </div>
      )}

      {/* Rendered Photo & Breakdown */}
      {!isLoading && photoData && (
        <div className="mt-4 space-y-3.5">
          {/* Image Frame */}
          <div className="relative rounded-2xl overflow-hidden bg-stone-950 border border-stone-200 shadow-sm group">
            <img
              src={photoData.imageUrl}
              alt={photoData.visualTitle || cropName}
              referrerPolicy="no-referrer"
              className={`w-full max-h-[300px] object-contain mx-auto transition-transform duration-200 ${
                isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />

            {/* Top Badge */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 backdrop-blur-xs text-white text-[11px] font-bold border border-emerald-600/50 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-lime-400" />
                <span>{photoData.crop || cropName}</span>
              </span>
            </div>

            {/* Bottom Overlay Actions */}
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsZoomed(!isZoomed)}
                className="p-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-900 text-white text-xs font-semibold backdrop-blur-xs border border-white/20 transition cursor-pointer"
                title={isZoomed ? 'Zoom Out' : 'Zoom In'}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleDownloadImage}
                className="px-2.5 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-emerald-950 text-xs font-bold flex items-center gap-1 shadow-md transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{t.downloadPhoto}</span>
              </button>
            </div>
          </div>

          {/* Title & Share */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <h5 className="font-extrabold text-stone-900 text-sm flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-emerald-700" />
              <span>{photoData.visualTitle}</span>
            </h5>
            <button
              type="button"
              onClick={handleShare}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1 transition cursor-pointer shrink-0"
            >
              {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedShare ? t.copied : (language === 'ta' ? 'பகிர்' : language === 'te' ? 'షేర్' : language === 'hi' ? 'शेयर' : 'Share')}</span>
            </button>
          </div>

          {/* Visual Indicators list */}
          {photoData.whatToLookFor && photoData.whatToLookFor.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-bold text-emerald-950 uppercase tracking-wider block">
                {t.whatToLookFor}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {photoData.whatToLookFor.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white border border-emerald-200/80 shadow-2xs flex items-start gap-2"
                  >
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
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

          {/* Healthy vs Damaged comparison if present */}
          {photoData.healthyVsDamaged && (
            <div className="p-2.5 rounded-xl bg-white border border-emerald-200/80 text-xs text-stone-700 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-emerald-900 block text-[11px]">
                  {t.healthyVsDamaged}
                </strong>
                <p className="text-stone-600 leading-relaxed text-xs">
                  {photoData.healthyVsDamaged}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
