import React, { useState, useEffect, useRef } from 'react';
import {
  District,
  POPULAR_DISTRICTS,
  WeatherData,
  fetchWeather,
} from '../services/weatherService';
import { Language, TRANSLATIONS } from '../data/translations';
import { Crop } from '../data/crops';
import {
  CloudSun,
  MapPin,
  Compass,
  Droplets,
  Wind,
  CloudRain,
  Thermometer,
  Sparkles,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Download,
  FileCode,
  Printer,
  FileText,
  Check,
} from 'lucide-react';
import {
  downloadTextFile,
  printHtmlViaIframe,
  generateWeatherBulletinHtml,
  triggerBlobDownload,
} from '../utils/downloadUtils';

interface WeatherForecastProps {
  language: Language;
  selectedCrop: Crop | null;
  onAskWeatherQuestion: (question: string) => void;
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({
  language,
  selectedCrop,
  onAskWeatherQuestion,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedDistrict, setSelectedDistrict] = useState<District>(POPULAR_DISTRICTS[0]); // Thanjavur by default
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (downloadRef.current && !downloadRef.current.contains(e.target as Node)) {
        setIsDownloadOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load weather when district changes
  useEffect(() => {
    loadWeather(
      selectedDistrict.latitude,
      selectedDistrict.longitude,
      selectedDistrict.nameEn,
      selectedDistrict.nameTa,
      selectedDistrict.nameTe,
      selectedDistrict.nameHi
    );
  }, [selectedDistrict]);

  const loadWeather = async (
    lat: number,
    lon: number,
    nameEn?: string,
    nameTa?: string,
    nameTe?: string,
    nameHi?: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchWeather(lat, lon, nameEn, nameTa, nameTe, nameHi);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Weather load error:', err);
      setErrorMessage(t.weatherError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage(
        language === 'ta'
          ? 'உங்கள் பிரவுசரில் GPS வசதி இல்லை'
          : language === 'te'
          ? 'మీ బ్రౌజర్‌లో GPS సదుపాయం లేదు'
          : language === 'hi'
          ? 'आपके ब्राउज़र में GPS सुविधा उपलब्ध नहीं है'
          : 'Geolocation is not supported by your browser'
      );
      return;
    }

    setIsDetectingGps(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const gpsNameEn = 'My Farm Location';
        const gpsNameTa = 'என் பண்ணை இருப்பிடம்';
        const gpsNameTe = 'నా పొలం లొకేషన్';
        const gpsNameHi = 'मेरे खेत का स्थान';

        await loadWeather(latitude, longitude, gpsNameEn, gpsNameTa, gpsNameTe, gpsNameHi);
        setIsDetectingGps(false);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setIsDetectingGps(false);
        setErrorMessage(
          language === 'ta'
            ? 'இருப்பிட அனுமதி வழங்கப்படவில்லை. பட்டியலிலிருந்து மாவட்டத்தைத் தேர்வு செய்யவும்.'
            : language === 'te'
            ? 'లొకేషన్ అనుమతి లభించలేదు. దయచేసి క్రింది జాబితా నుండి జిల్లాను ఎంచుకోండి.'
            : language === 'hi'
            ? 'स्थान की अनुमति नहीं मिली। कृपया नीचे दी गई सूची से जिला चुनें।'
            : 'Location permission denied. Please choose a district from the list below.'
        );
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  const getLocName = () => {
    if (!weatherData) return '';
    if (language === 'ta') return weatherData.locationNameTa;
    if (language === 'te') return weatherData.locationNameTe;
    if (language === 'hi') return weatherData.locationNameHi;
    return weatherData.locationNameEn;
  };

  const getActiveCropName = () => {
    if (!selectedCrop) return '';
    if (language === 'ta') return selectedCrop.nameTa;
    if (language === 'te') return selectedCrop.nameTe;
    if (language === 'hi') return selectedCrop.nameHi;
    return selectedCrop.nameEn;
  };

  const getCurrentCondition = () => {
    if (!weatherData) return '';
    if (language === 'ta') return weatherData.current.conditionTa;
    if (language === 'te') return weatherData.current.conditionTe;
    if (language === 'hi') return weatherData.current.conditionHi;
    return weatherData.current.conditionEn;
  };

  const handleTriggerWeatherAdvice = () => {
    if (!weatherData) return;

    const cropName = selectedCrop
      ? getActiveCropName()
      : (language === 'ta' ? 'பயிர்கள்' : language === 'te' ? 'పంటలు' : language === 'hi' ? 'फसल' : 'Crops');

    const loc = getLocName();
    const temp = weatherData.current.temperature;
    const condition = getCurrentCondition();

    let question = `In ${loc}, current weather is ${temp}°C (${condition}). How should I schedule irrigation and pest spraying for ${cropName} over the next 5 days?`;
    if (language === 'ta') {
      question = `${loc} பகுதியில் தற்போதைய வெப்பநிலை ${temp}°C, வானிலை: ${condition}. அடுத்த 5 நாட்களுக்கு ${cropName} பயிருக்கு உரம் தெளிப்பது மற்றும் நீர் பாசனத்தை எவ்வாறு திட்டமிட வேண்டும்?`;
    } else if (language === 'te') {
      question = `${loc} ప్రాంతంలో ప్రస్తుత ఉష్ణోగ్రత ${temp}°C, వాతావరణం: ${condition}. రాబోయే 5 రోజుల్లో ${cropName} పంటకు నీటి పారుదల మరియు పురుగుమందుల పిచికారీని ఎలా ప్రణాళిక చేసుకోవాలి?`;
    } else if (language === 'hi') {
      question = `${loc} में वर्तमान तापमान ${temp}°C और मौसम: ${condition} है। अगले 5 दिनों के लिए ${cropName} की सिंचाई और कीटनाशक/उर्वरक छिड़काव की योजना कैसे बनाएं?`;
    }

    onAskWeatherQuestion(question);
  };

  const getCleanDate = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getDayCond = (d: any) =>
    language === 'ta' ? d.conditionTa : language === 'te' ? d.conditionTe : language === 'hi' ? d.conditionHi : d.conditionEn;

  const getDaySpray = (d: any) =>
    language === 'ta' ? d.sprayAdvisoryTa : language === 'te' ? d.sprayAdvisoryTe : language === 'hi' ? d.sprayAdvisoryHi : d.sprayAdvisoryEn;

  const getDayIrrig = (d: any) =>
    language === 'ta' ? d.irrigationAdvisoryTa : language === 'te' ? d.irrigationAdvisoryTe : language === 'hi' ? d.irrigationAdvisoryHi : d.irrigationAdvisoryEn;

  const getDayTitle = (d: any) =>
    language === 'ta' ? d.dayNameTa : language === 'te' ? d.dayNameTe : language === 'hi' ? d.dayNameHi : d.dayNameEn;

  const handleDownloadWeatherHtml = () => {
    if (!weatherData) return;
    const locName = getLocName();
    const cropTitle = selectedCrop ? getActiveCropName() : undefined;
    const today = weatherData.forecast[0];

    const html = generateWeatherBulletinHtml({
      locationName: locName,
      temperature: weatherData.current.temperature,
      condition: getCurrentCondition(),
      humidity: weatherData.current.humidity,
      windSpeed: weatherData.current.windSpeed,
      rainChance: today ? today.precipitationProb : 0,
      sprayAdvisory: today ? getDaySpray(today) : 'Check daily wind',
      irrigationAdvisory: today ? getDayIrrig(today) : 'Irrigate normally',
      forecastDays: weatherData.forecast.map((d) => ({
        day: getDayTitle(d),
        condition: getDayCond(d),
        maxTemp: d.tempMax,
        minTemp: d.tempMin,
        rainChance: d.precipitationProb,
      })),
      language,
      cropName: cropTitle,
    });

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const filename = `BhuMitra_Weather_${selectedDistrict.nameEn}_${getCleanDate()}.html`;
    triggerBlobDownload(blob, filename);
    setIsDownloadOpen(false);
    setDownloadSuccessMsg(`${filename} ${t.downloadSuccess}`);
    setTimeout(() => setDownloadSuccessMsg(null), 3500);
  };

  const handlePrintWeather = () => {
    if (!weatherData) return;
    const locName = getLocName();
    const cropTitle = selectedCrop ? getActiveCropName() : undefined;
    const today = weatherData.forecast[0];

    const html = generateWeatherBulletinHtml({
      locationName: locName,
      temperature: weatherData.current.temperature,
      condition: getCurrentCondition(),
      humidity: weatherData.current.humidity,
      windSpeed: weatherData.current.windSpeed,
      rainChance: today ? today.precipitationProb : 0,
      sprayAdvisory: today ? getDaySpray(today) : 'Check daily wind',
      irrigationAdvisory: today ? getDayIrrig(today) : 'Irrigate normally',
      forecastDays: weatherData.forecast.map((d) => ({
        day: getDayTitle(d),
        condition: getDayCond(d),
        maxTemp: d.tempMax,
        minTemp: d.tempMin,
        rainChance: d.precipitationProb,
      })),
      language,
      cropName: cropTitle,
    });

    printHtmlViaIframe(html);
    setIsDownloadOpen(false);
  };

  const handleDownloadWeatherTxt = () => {
    if (!weatherData) return;
    const locName = getLocName();
    const cropTitle = selectedCrop ? getActiveCropName() : undefined;
    const today = weatherData.forecast[0];

    let text = `==================================================\n`;
    text += `BHUMITRA FARM WEATHER BULLETIN\n`;
    text += `==================================================\n\n`;
    text += `District / Farm: ${locName}\n`;
    if (cropTitle) text += `Target Crop: ${cropTitle}\n`;
    text += `Date: ${new Date().toLocaleString()}\n`;
    text += `Current Temp: ${weatherData.current.temperature}°C (${getCurrentCondition()})\n`;
    text += `Humidity: ${weatherData.current.humidity}%\n`;
    text += `Wind Speed: ${weatherData.current.windSpeed} km/h\n\n`;

    if (today) {
      text += `--------------------------------------------------\n`;
      text += `AGRICULTURAL ADVISORY:\n`;
      text += `Spraying Window: ${getDaySpray(today)}\n`;
      text += `Irrigation Advice: ${getDayIrrig(today)}\n`;
      text += `--------------------------------------------------\n\n`;
    }

    text += `5-DAY AGRICULTURAL FORECAST:\n`;
    weatherData.forecast.forEach((d) => {
      text += `${getDayTitle(d)}: ${d.tempMax}°C / ${d.tempMin}°C | ${getDayCond(d)} | Rain: ${d.precipitationProb}%\n`;
    });
    text += `\n==================================================\n`;
    text += `Issued by BhuMitra AI Agri-Met Service\n`;

    const filename = `BhuMitra_Weather_${selectedDistrict.nameEn}_${getCleanDate()}.txt`;
    downloadTextFile(filename, text);
    setIsDownloadOpen(false);
    setDownloadSuccessMsg(`${filename} ${t.downloadSuccess}`);
    setTimeout(() => setDownloadSuccessMsg(null), 3500);
  };

  const getDistrictDisplayName = (dist: District) => {
    if (language === 'ta') return `${dist.nameTa} (${dist.stateTa})`;
    if (language === 'te') return `${dist.nameTe} (${dist.stateTe})`;
    if (language === 'hi') return `${dist.nameHi} (${dist.stateHi})`;
    return `${dist.nameEn} (${dist.stateEn})`;
  };

  const getCropFieldLabel = () => {
    if (language === 'ta') return 'பயிர்:';
    if (language === 'te') return 'పంట:';
    if (language === 'hi') return 'फसल:';
    return 'Crop:';
  };

  const getSprayTip = () => {
    if (language === 'ta') return 'காற்றின் வேகம் 15 km/h குறைவாகவும் மழை இல்லாத போதும் உரம்/பூச்சிக்கொல்லி தெளிக்கவும்.';
    if (language === 'te') return 'గాలి వేగం 15 km/h లోపు ఉన్నప్పుడు మరియు వర్షం లేనప్పుడు మాత్రమే మందులు పిచికారీ చేయండి.';
    if (language === 'hi') return 'हवा की गति 15 किमी/घंटे से कम होने और बारिश न होने पर ही दवा का छिड़काव करें।';
    return 'Spray when wind speed is under 15 km/h and rain chance is low for optimal foliar absorption.';
  };

  const getIrrigationTip = () => {
    if (language === 'ta') return 'அதிக வெப்ப நாளில் அதிகாலையிலோ அல்லது மாலையிலோ நீர் பாய்ச்சவும்.';
    if (language === 'te') return 'ఎండ తీవ్రత ఉన్నప్పుడు ఉదయాన్నే లేదా సాయంత్రం వేళల్లో మాత్రమే నీరు పారించండి.';
    if (language === 'hi') return 'तेज धूप में वाष्पीकरण से बचने हेतु सुबह जल्दी या शाम के समय ही सिंचाई करें।';
    return 'Irrigate during early morning or evening hours to minimize water loss by evaporation.';
  };

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-stone-200/80">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-lime-100 text-emerald-800 flex items-center justify-center text-base shadow-xs">
              ⛅
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-stone-900 tracking-tight">
              {t.weatherTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 pl-10">
            {t.weatherSubtitle}
          </p>
        </div>

        {/* Location Controls: GPS Detect & District Dropdown & Download Bulletin */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          {/* Download Bulletin Dropdown */}
          <div className="relative" ref={downloadRef}>
            <button
              onClick={() => setIsDownloadOpen((prev) => !prev)}
              disabled={!weatherData || isLoading}
              className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              title={t.downloadWeather}
            >
              <Download className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t.download}</span>
              <ChevronDown className={`w-3 h-3 text-emerald-700 transition-transform ${isDownloadOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDownloadOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-40 animate-in fade-in duration-100">
                <button
                  onClick={handleDownloadWeatherHtml}
                  className="w-full text-left px-3 py-2 text-xs text-stone-800 hover:bg-emerald-50 hover:text-emerald-900 font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  <FileCode className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t.downloadBulletinHtml}</span>
                </button>
                <button
                  onClick={handlePrintWeather}
                  className="w-full text-left px-3 py-2 text-xs text-stone-800 hover:bg-emerald-50 hover:text-emerald-900 font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{t.printDirect}</span>
                </button>
                <button
                  onClick={handleDownloadWeatherTxt}
                  className="w-full text-left px-3 py-2 text-xs text-stone-800 hover:bg-emerald-50 hover:text-emerald-900 font-semibold flex items-center gap-2 transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{t.downloadBulletinTxt}</span>
                </button>
              </div>
            )}
          </div>

          {/* Use GPS Button */}
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isDetectingGps}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
              isDetectingGps
                ? 'bg-stone-200 text-stone-600'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}
            title={t.useMyLocation}
          >
            {isDetectingGps ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
            )}
            <span>{isDetectingGps ? t.detectingLocation : t.useMyLocation}</span>
          </button>

          {/* District Selector dropdown */}
          <div className="relative">
            <select
              value={selectedDistrict.nameEn}
              onChange={(e) => {
                const found = POPULAR_DISTRICTS.find((d) => d.nameEn === e.target.value);
                if (found) setSelectedDistrict(found);
              }}
              className="appearance-none bg-stone-50 hover:bg-stone-100 border border-stone-300 text-stone-800 text-xs font-bold rounded-xl px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              {POPULAR_DISTRICTS.map((dist) => (
                <option key={dist.nameEn} value={dist.nameEn}>
                  {getDistrictDisplayName(dist)}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-stone-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Weather Download Toast if active */}
      {downloadSuccessMsg && (
        <div className="mt-3 p-2 px-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <Check className="w-3.5 h-3.5 text-emerald-700" />
          <span>{downloadSuccessMsg}</span>
        </div>
      )}

      {/* Error Notice */}
      {errorMessage && (
        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-8 h-8 border-3 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
          <p className="text-xs sm:text-sm font-semibold text-stone-600">
            {t.loadingWeather}
          </p>
        </div>
      ) : weatherData ? (
        <div className="mt-5 space-y-5">
          {/* Main Weather Overview (Split into Current + Smart Advisory) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Current Weather Card */}
            <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-green-950 text-white p-5 shadow-md border border-emerald-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-200 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-lime-400" />
                    <span className="truncate">
                      {getLocName()}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2 py-0.5 rounded-full">
                    {t.currentWeather}
                  </span>
                </div>

                {/* Big Temp & Icon */}
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                      {weatherData.current.temperature}°<span className="text-2xl font-normal text-emerald-200">C</span>
                    </div>
                    <p className="text-xs text-emerald-200 mt-1">
                      {t.feelsLike}: {weatherData.current.feelsLike}°C
                    </p>
                  </div>
                  <span className="text-5xl filter drop-shadow-md">
                    {weatherData.current.icon}
                  </span>
                </div>

                <div className="mt-2 text-sm font-bold text-lime-300">
                  {getCurrentCondition()}
                </div>
              </div>

              {/* Quick 3-metric row */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-emerald-700/60 text-center">
                <div className="p-2 rounded-xl bg-emerald-900/60 border border-emerald-700/50">
                  <div className="flex items-center justify-center gap-1 text-emerald-300 text-[10px] font-semibold mb-0.5">
                    <Droplets className="w-3 h-3 text-sky-400" />
                    <span>{t.humidity}</span>
                  </div>
                  <div className="font-extrabold text-sm">{weatherData.current.humidity}%</div>
                </div>

                <div className="p-2 rounded-xl bg-emerald-900/60 border border-emerald-700/50">
                  <div className="flex items-center justify-center gap-1 text-emerald-300 text-[10px] font-semibold mb-0.5">
                    <Wind className="w-3 h-3 text-lime-400" />
                    <span>{t.wind}</span>
                  </div>
                  <div className="font-extrabold text-sm">{weatherData.current.windSpeed} km/h</div>
                </div>

                <div className="p-2 rounded-xl bg-emerald-900/60 border border-emerald-700/50">
                  <div className="flex items-center justify-center gap-1 text-emerald-300 text-[10px] font-semibold mb-0.5">
                    <CloudRain className="w-3 h-3 text-blue-400" />
                    <span>{t.rainChance}</span>
                  </div>
                  <div className="font-extrabold text-sm">
                    {weatherData.forecast[0]?.precipitationProb || 0}%
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Agricultural Advisory Banner */}
            <div className="lg:col-span-2 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">
                    {t.agriAdvisoryTitle}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-sans">
                  {language === 'ta'
                    ? weatherData.agriSummaryTa
                    : language === 'te'
                    ? weatherData.agriSummaryTe
                    : language === 'hi'
                    ? weatherData.agriSummaryHi
                    : weatherData.agriSummaryEn}
                </p>

                {/* Practical Quick Rules */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-white border border-emerald-200/60 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.sprayAdvisory}:</span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        weatherData.forecast[0]?.sprayAdvisoryEn === 'Good Window'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {weatherData.forecast[0] ? getDaySpray(weatherData.forecast[0]) : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-snug">
                      {getSprayTip()}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-emerald-200/60 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900 mb-1">
                      <Droplets className="w-3.5 h-3.5 text-sky-600" />
                      <span>{t.irrigationAdvisory}:</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-sky-100 text-sky-800">
                        {weatherData.forecast[0] ? getDayIrrig(weatherData.forecast[0]) : ''}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 leading-snug">
                      {getIrrigationTip()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button: Ask AI advice for this weather */}
              <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between gap-3">
                <span className="text-xs text-emerald-900 font-medium hidden sm:inline">
                  {selectedCrop ? (
                    <span>
                      {getCropFieldLabel()}{' '}
                      <strong>{getActiveCropName()}</strong>
                    </span>
                  ) : null}
                </span>

                <button
                  type="button"
                  onClick={handleTriggerWeatherAdvice}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-lime-300" />
                  <span>{t.askWeatherQuestion}</span>
                </button>
              </div>
            </div>
          </div>

          {/* 5-Day Agricultural Forecast Cards */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-emerald-700" />
              <h3 className="font-extrabold text-stone-900 text-sm sm:text-base">
                {t.forecast5Day}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {weatherData.forecast.map((day, idx) => (
                <div
                  key={day.date}
                  className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                    idx === 0
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-xs'
                      : 'border-stone-200 bg-stone-50/40 hover:bg-white'
                  }`}
                >
                  {/* Day Title & Date */}
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
                    <span className="font-bold text-xs text-stone-900">
                      {getDayTitle(day)}
                    </span>
                    <span className="text-[10px] text-stone-500 font-medium">
                      {day.date.split('-').slice(1).join('/')}
                    </span>
                  </div>

                  {/* Icon & Temp */}
                  <div className="py-2.5 text-center">
                    <div className="text-3xl mb-1 filter drop-shadow-xs">
                      {day.icon}
                    </div>
                    <div className="text-xs font-bold text-stone-900">
                      <span>{day.tempMax}°</span>
                      <span className="text-stone-400 font-normal ml-1">{day.tempMin}°C</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-0.5 line-clamp-1 leading-tight">
                      {getDayCond(day)}
                    </p>
                  </div>

                  {/* Rain & Wind indicators */}
                  <div className="space-y-1.5 pt-2 border-t border-stone-200/60 text-[10px]">
                    <div className="flex items-center justify-between text-stone-600">
                      <span className="flex items-center gap-0.5">
                        <CloudRain className="w-3 h-3 text-blue-500" />
                        <span>{day.precipitationProb}%</span>
                      </span>
                      <span>{day.precipitationSum} mm</span>
                    </div>

                    {/* Spray badge */}
                    <div className={`px-1.5 py-0.5 rounded-md text-center font-bold text-[9px] ${
                      day.sprayAdvisoryEn === 'Good Window'
                        ? 'bg-emerald-100 text-emerald-800'
                        : day.sprayAdvisoryEn === 'Caution (Wind)'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {getDaySpray(day)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};
