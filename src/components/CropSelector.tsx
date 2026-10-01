import React, { useState } from 'react';
import { CROPS, Crop } from '../data/crops';
import { Language, TRANSLATIONS } from '../data/translations';
import { Check, Droplets, Calendar, Filter, Sparkles } from 'lucide-react';

interface CropSelectorProps {
  language: Language;
  selectedCrop: Crop | null;
  onSelectCrop: (crop: Crop) => void;
}

export const CropSelector: React.FC<CropSelectorProps> = ({
  language,
  selectedCrop,
  onSelectCrop,
}) => {
  const t = TRANSLATIONS[language];
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: t.allCrops },
    { id: 'cereal', label: t.cereals },
    { id: 'vegetable', label: t.vegetables },
    { id: 'cash_crop', label: t.cashCrops },
    { id: 'fruit', label: t.fruits },
    { id: 'oilseed', label: t.oilseeds },
  ];

  const getCropName = (c: Crop) => {
    if (language === 'ta') return c.nameTa;
    if (language === 'te') return c.nameTe;
    if (language === 'hi') return c.nameHi;
    return c.nameEn;
  };

  const getCropCategoryLabel = (c: Crop) => {
    if (language === 'ta') return c.categoryLabelTa;
    if (language === 'te') return c.categoryLabelTe;
    if (language === 'hi') return c.categoryLabelHi;
    return c.categoryLabelEn;
  };

  const getCropWaterNeed = (c: Crop) => {
    if (language === 'ta') return c.waterNeedTa;
    if (language === 'te') return c.waterNeedTe;
    if (language === 'hi') return c.waterNeedHi;
    return c.waterNeed;
  };

  const getCropSeason = (c: Crop) => {
    if (language === 'ta') return c.seasonTa;
    if (language === 'te') return c.seasonTe;
    if (language === 'hi') return c.seasonHi;
    return c.seasonEn;
  };

  const filteredCrops = activeCategory === 'all'
    ? CROPS
    : CROPS.filter(c => c.category === activeCategory);

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-stone-200/80">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold">
              1
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight">
              {t.selectCropTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 pl-9">
            {t.selectCropDesc}
          </p>
        </div>

        {/* Selected badge status */}
        {selectedCrop && (
          <div className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>
              {t.selectedCropBadge}:{' '}
              <strong>
                {getCropName(selectedCrop)}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        <Filter className="w-4 h-4 text-stone-400 shrink-0 ml-1 mr-1" />
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200/80 hover:text-stone-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {filteredCrops.map((crop) => {
          const isSelected = selectedCrop?.id === crop.id;
          return (
            <button
              key={crop.id}
              onClick={() => onSelectCrop(crop)}
              className={`group relative text-left p-3.5 rounded-2xl border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between h-[138px] ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-md shadow-emerald-900/5 ring-2 ring-emerald-500/20'
                  : 'border-stone-200 hover:border-emerald-300 bg-stone-50/40 hover:bg-white hover:shadow-xs'
              }`}
            >
              {/* Top row: Emoji & Category/Checkmark */}
              <div className="flex items-start justify-between">
                <span className="text-3xl filter drop-shadow-xs group-hover:scale-110 transition-transform">
                  {crop.icon}
                </span>

                {isSelected ? (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                ) : (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-500 truncate max-w-[70px]">
                    {getCropCategoryLabel(crop)}
                  </span>
                )}
              </div>

              {/* Crop Name */}
              <div className="mt-2">
                <h3 className="font-bold text-sm text-stone-900 leading-tight group-hover:text-emerald-800 transition-colors">
                  {getCropName(crop)}
                </h3>
                {language !== 'en' && (
                  <p className="text-[11px] text-stone-500 leading-none mt-0.5 truncate">
                    {crop.nameEn}
                  </p>
                )}
              </div>

              {/* Water & Season meta info */}
              <div className="flex items-center gap-2 pt-1 border-t border-stone-200/60 text-[10px] text-stone-500">
                <span className="flex items-center gap-0.5">
                  <Droplets className="w-3 h-3 text-sky-500" />
                  {getCropWaterNeed(crop)}
                </span>
                <span className="truncate">
                  {getCropSeason(crop)}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
