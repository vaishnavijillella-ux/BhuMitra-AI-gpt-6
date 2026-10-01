import React from 'react';

export const BackgroundDesign: React.FC = () => {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Subtle Terrace Farm Landscape Backdrop Blend (Top Header Region) */}
      <div className="absolute top-0 left-0 right-0 h-96 opacity-10 mix-blend-multiply overflow-hidden">
        <img
          src="/src/assets/images/farm_background_pattern_1790846879950.jpg"
          alt=""
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-100/70 to-stone-100" />
      </div>

      {/* 2. Ambient Radiant Sun & Field Light Orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-amber-200/30 via-lime-200/25 to-transparent blur-3xl" />
      <div className="absolute top-1/3 -left-40 w-[30rem] h-[30rem] rounded-full bg-gradient-to-tr from-emerald-200/25 via-green-100/20 to-transparent blur-3xl" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-tl from-teal-200/20 via-sky-100/20 to-transparent blur-3xl" />

      {/* 3. Precision Smart Farming Grid (Subtle coordinate grid) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="agri-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="#065f46"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
            <circle cx="24" cy="24" r="1.5" fill="#047857" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#agri-grid)" />
      </svg>

      {/* 4. Terrace Farm Topographic Contour Curves (Flowing Agrarian Lines) */}
      <svg
        className="absolute top-0 right-0 w-[55rem] h-[35rem] opacity-[0.07] text-emerald-800"
        viewBox="0 0 900 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 0 80 Q 250 150 500 70 T 900 130"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
        />
        <path
          d="M 0 170 Q 260 250 530 160 T 900 230"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 0 270 Q 280 340 560 250 T 900 320"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeDasharray="6 4"
          fill="none"
        />
        <path
          d="M 0 380 Q 300 450 590 350 T 900 430"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M 0 490 Q 320 540 620 460 T 900 520"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
      </svg>

      {/* 5. Left Bottom Contour Curves */}
      <svg
        className="absolute bottom-0 left-0 w-[50rem] h-[30rem] opacity-[0.05] text-emerald-900"
        viewBox="0 0 800 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M 0 100 C 200 40 400 180 800 120"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M 0 220 C 220 160 450 300 800 240"
          stroke="currentColor"
          strokeWidth="1.8"
          fill="none"
        />
        <path
          d="M 0 340 C 240 280 500 400 800 350"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          fill="none"
        />
      </svg>

      {/* 6. Subtle Floating Botanical Accents */}
      <div className="absolute top-28 left-8 text-emerald-700/10 text-4xl animate-pulse">
        🌱
      </div>
      <div className="absolute top-64 right-16 text-amber-600/10 text-5xl">
        🌾
      </div>
      <div className="absolute bottom-48 left-16 text-emerald-700/10 text-5xl">
        🍃
      </div>
      <div className="absolute bottom-24 right-28 text-sky-600/10 text-4xl">
        💧
      </div>
    </div>
  );
};
