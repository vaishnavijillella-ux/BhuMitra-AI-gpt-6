import React from 'react';
import { Sprout, Globe, PhoneCall, Camera } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { Crop } from '../data/crops';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  selectedCrop: Crop | null;
  onOpenPhotoStudio?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  selectedCrop,
  onOpenPhotoStudio,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-emerald-900/95 backdrop-blur-md text-white border-b border-emerald-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 flex items-center justify-center shadow-lg shadow-emerald-950/30 text-emerald-950">
            <Sprout className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-emerald-100 via-lime-200 to-white bg-clip-text text-transparent">
                {t.appTitle}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-lime-400 text-emerald-950 px-2 py-0.5 rounded-full shadow-xs">
                Kisan AI
              </span>
            </div>
            <p className="text-xs text-emerald-200 hidden sm:block">
              {t.appTagline}
            </p>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2.5">
          {/* Active crop indicator if selected */}
          {selectedCrop && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-700 text-xs text-emerald-100">
              <span className="text-sm">{selectedCrop.icon}</span>
              <span className="font-medium">
                {language === 'ta'
                  ? selectedCrop.nameTa
                  : language === 'te'
                  ? selectedCrop.nameTe
                  : language === 'hi'
                  ? selectedCrop.nameHi
                  : selectedCrop.nameEn}
              </span>
            </div>
          )}

          {/* Visual Photo Studio button */}
          {onOpenPhotoStudio && (
            <button
              onClick={onOpenPhotoStudio}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-lime-400/20 hover:bg-lime-400/30 text-lime-300 hover:text-lime-200 border border-lime-400/40 text-xs font-bold transition cursor-pointer shadow-xs"
              title={t.visualPhotoStudio}
            >
              <Camera className="w-3.5 h-3.5 text-lime-400" />
              <span className="hidden sm:inline">{t.visualPhotoStudio}</span>
              <span className="sm:hidden">{language === 'ta' ? 'படம்' : language === 'te' ? 'ఫోటో' : language === 'hi' ? 'फोटो' : 'Photo'}</span>
            </button>
          )}

          {/* Kisan Call Center Helpline badge */}
          <a
            href="tel:18001801551"
            title="Kisan Call Centre Toll Free: 1800-180-1551"
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs font-semibold transition border border-emerald-700/60"
          >
            <PhoneCall className="w-3.5 h-3.5 text-lime-400" />
            <span>Kisan 1800-180-1551</span>
          </a>

          {/* Multilingual Language Switcher (EN, TA, TE, HI) */}
          <div className="flex items-center bg-emerald-950/80 p-0.5 rounded-xl border border-emerald-700/70 overflow-x-auto max-w-[280px] sm:max-w-none scrollbar-none">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                language === 'en'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
              aria-label="Switch to English"
            >
              <span>English</span>
            </button>
            <button
              onClick={() => onLanguageChange('ta')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                language === 'ta'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
              aria-label="Switch to Tamil"
            >
              <span>தமிழ்</span>
            </button>
            <button
              onClick={() => onLanguageChange('te')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                language === 'te'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
              aria-label="Switch to Telugu"
            >
              <span>తెలుగు</span>
            </button>
            <button
              onClick={() => onLanguageChange('hi')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                language === 'hi'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-300 hover:text-white'
              }`}
              aria-label="Switch to Hindi"
            >
              <span>हिन्दी</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
