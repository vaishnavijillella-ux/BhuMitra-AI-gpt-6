import React from 'react';
import { Language, TRANSLATIONS } from '../data/translations';
import { Search, Camera, Volume2, ShieldCheck, PhoneCall, HelpCircle, Download } from 'lucide-react';

interface InfoBannerProps {
  language: Language;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({ language }) => {
  const t = TRANSLATIONS[language];

  const features = [
    {
      icon: <Search className="w-5 h-5 text-blue-600" />,
      title: t.feature1Title,
      desc: t.feature1Desc,
      tag: 'Gemini 3.5 Flash',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      icon: <Camera className="w-5 h-5 text-emerald-600" />,
      title: t.feature2Title,
      desc: t.feature2Desc,
      tag: 'Gemini 3.1 Pro',
      color: 'bg-emerald-50 border-emerald-200',
    },
    {
      icon: <Volume2 className="w-5 h-5 text-amber-600" />,
      title: t.feature3Title,
      desc: t.feature3Desc,
      tag: 'Gemini 3.8 TTS',
      color: 'bg-amber-50 border-amber-200',
    },
    {
      icon: <Download className="w-5 h-5 text-lime-600" />,
      title: t.feature4Title,
      desc: t.feature4Desc,
      tag: 'PDF & Audio',
      color: 'bg-lime-50 border-lime-200',
    },
  ];

  return (
    <footer className="mt-10 border-t border-stone-200 pt-8 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Features Row */}
        <h4 className="text-center font-bold text-stone-800 text-sm sm:text-base mb-6">
          {t.featuresHeader}
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${f.color} transition-all hover:shadow-xs`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-xl bg-white shadow-xs">
                  {f.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 text-stone-600 border border-stone-200">
                  {f.tag}
                </span>
              </div>
              <h5 className="font-bold text-stone-900 text-sm mb-1">{f.title}</h5>
              <p className="text-xs text-stone-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Emergency Farmer Help Banner */}
        <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-green-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-lime-400 text-emerald-950 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-sm sm:text-base">
                {language === 'ta'
                  ? 'அரசு கிசான் அழைப்பு மையம் (இலவசம்)'
                  : language === 'te'
                  ? 'కిసాన్ కాల్ సెంటర్ (భారత ప్రభుత్వం - ఉచితం)'
                  : language === 'hi'
                  ? 'किसान कॉल सेंटर (भारत सरकार - निःशुल्क)'
                  : 'Kisan Call Centre (Govt. of India)'}
              </h5>
              <p className="text-xs text-emerald-200">
                {language === 'ta'
                  ? 'விவசாய அவசர உதவிக்கு 1800-180-1551 என்ற எண்ணை தொடர்புகொள்ளவும் (காலை 6 மணி - இரவு 10 மணி)'
                  : language === 'te'
                  ? 'ఉచిత వ్యవసాయ నిపుణుల సహాయం కోసం 1800-180-1551 కు కాల్ చేయండి (రోజూ ఉదయం 6 నుండి రాత్రి 10 వరకు)'
                  : language === 'hi'
                  ? 'निःशुल्क कृषि विशेषज्ञ सहायता हेतु 1800-180-1551 पर संपर्क करें (सुबह 6 से रात 10 बजे तक)'
                  : 'Toll-free agricultural specialist support: 1800-180-1551 (6 AM to 10 PM daily)'}
              </p>
            </div>
          </div>
          <a
            href="tel:18001801551"
            className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold text-xs sm:text-sm transition shadow-sm whitespace-nowrap cursor-pointer"
          >
            {language === 'ta'
              ? '📞 1800-180-1551 அழைக்க'
              : language === 'te'
              ? '📞 1800-180-1551 కి కాల్ చేయండి'
              : language === 'hi'
              ? '📞 1800-180-1551 पर कॉल करें'
              : '📞 Call 1800-180-1551'}
          </a>
        </div>

        {/* Copyright notice */}
        <p className="text-center text-xs text-stone-400 mt-6">
          🌾 BhuMitra AI • Empowering Farmers with Intelligent Agriculture • Made for Indian Farming Communities
        </p>
      </div>
    </footer>
  );
};
