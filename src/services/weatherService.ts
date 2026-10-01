import { Language } from '../data/translations';

export interface District {
  nameEn: string;
  nameTa: string;
  nameTe: string;
  nameHi: string;
  stateEn: string;
  stateTa: string;
  stateTe: string;
  stateHi: string;
  latitude: number;
  longitude: number;
}

export const POPULAR_DISTRICTS: District[] = [
  // Tamil Nadu
  { nameEn: 'Thanjavur', nameTa: 'தஞ்சாவூர்', nameTe: 'తంజావూరు', nameHi: 'तंजावुर', stateEn: 'Tamil Nadu', stateTa: 'தமிழ்நாடு', stateTe: 'తమిళనాడు', stateHi: 'तमिलनाडु', latitude: 10.787, longitude: 79.1378 },
  { nameEn: 'Coimbatore', nameTa: 'கோயம்புத்தூர்', nameTe: 'కోయంబత్తూరు', nameHi: 'कोयंबटूर', stateEn: 'Tamil Nadu', stateTa: 'தமிழ்நாடு', stateTe: 'తమిళనాడు', stateHi: 'तमिलनाडु', latitude: 11.0168, longitude: 76.9558 },
  { nameEn: 'Madurai', nameTa: 'மதுரை', nameTe: 'మధురై', nameHi: 'मदुरै', stateEn: 'Tamil Nadu', stateTa: 'தமிழ்நாடு', stateTe: 'తమిళనాడు', stateHi: 'तमिलनाडु', latitude: 9.9252, longitude: 78.1198 },
  { nameEn: 'Salem', nameTa: 'சேலம்', nameTe: 'సేలం', nameHi: 'सेलम', stateEn: 'Tamil Nadu', stateTa: 'தமிழ்நாடு', stateTe: 'తమిళనాడు', stateHi: 'तमिलनाडु', latitude: 11.6643, longitude: 78.146 },
  
  // Andhra Pradesh & Telangana (Telugu)
  { nameEn: 'Guntur', nameTa: 'குண்டூர்', nameTe: 'గుంటూరు', nameHi: 'गुंटूर', stateEn: 'Andhra Pradesh', stateTa: 'ஆந்திரா', stateTe: 'ఆంధ్రప్రదేశ్', stateHi: 'आंध्र प्रदेश', latitude: 16.3067, longitude: 80.4365 },
  { nameEn: 'Kurnool', nameTa: 'கர்னூல்', nameTe: 'కర్నూలు', nameHi: 'कुरनूल', stateEn: 'Andhra Pradesh', stateTa: 'ஆந்திரா', stateTe: 'ఆంధ్రప్రదేశ్', stateHi: 'आंध्र प्रदेश', latitude: 15.8281, longitude: 78.0373 },
  { nameEn: 'Warangal', nameTa: 'வாரங்கல்', nameTe: 'వరంగల్', nameHi: 'वारंगल', stateEn: 'Telangana', stateTa: 'தெலுங்கானா', stateTe: 'తెలంగాణ', stateHi: 'तेलंगाना', latitude: 17.9784, longitude: 79.5941 },
  { nameEn: 'Nizamabad', nameTa: 'நிஜாமாபாத்', nameTe: 'నిజామాబాద్', nameHi: 'निजामाबाद', stateEn: 'Telangana', stateTa: 'தெலுங்கானா', stateTe: 'తెలంగాణ', stateHi: 'तेलंगाना', latitude: 18.6725, longitude: 78.0941 },
  
  // North / Central India (Hindi)
  { nameEn: 'Varanasi', nameTa: 'வாரணாசி', nameTe: 'వారణాసి', nameHi: 'वाराणसी', stateEn: 'Uttar Pradesh', stateTa: 'உத்தரப் பிரதேசம்', stateTe: 'ఉత్తరప్రదేశ్', stateHi: 'उत्तर प्रदेश', latitude: 25.3176, longitude: 82.9739 },
  { nameEn: 'Indore', nameTa: 'இந்தூர்', nameTe: 'ఇండోర్', nameHi: 'इंदौर', stateEn: 'Madhya Pradesh', stateTa: 'மத்திய பிரதேசம்', stateTe: 'మధ్యప్రదేశ్', stateHi: 'मध्य प्रदेश', latitude: 22.7196, longitude: 75.8577 },
  { nameEn: 'Karnal', nameTa: 'கர்னால்', nameTe: 'కర్నాల్', nameHi: 'करनाल', stateEn: 'Haryana', stateTa: 'ஹரியானா', stateTe: 'హర్యానా', stateHi: 'हरियाणा', latitude: 29.6857, longitude: 76.9905 },
  { nameEn: 'Patna', nameTa: 'பாட்னா', nameTe: 'పాట్నా', nameHi: 'पटना', stateEn: 'Bihar', stateTa: 'பீகார்', stateTe: 'బీహార్', stateHi: 'बिहार', latitude: 25.5941, longitude: 85.1376 },
];

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  conditionEn: string;
  conditionTa: string;
  conditionTe: string;
  conditionHi: string;
  icon: string;
  isDay: boolean;
  time: string;
}

export interface DayForecast {
  date: string;
  dayNameEn: string;
  dayNameTa: string;
  dayNameTe: string;
  dayNameHi: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProb: number;
  windSpeedMax: number;
  weatherCode: number;
  conditionEn: string;
  conditionTa: string;
  conditionTe: string;
  conditionHi: string;
  icon: string;
  sprayAdvisoryEn: string;
  sprayAdvisoryTa: string;
  sprayAdvisoryTe: string;
  sprayAdvisoryHi: string;
  irrigationAdvisoryEn: string;
  irrigationAdvisoryTa: string;
  irrigationAdvisoryTe: string;
  irrigationAdvisoryHi: string;
}

export interface WeatherData {
  locationNameEn: string;
  locationNameTa: string;
  locationNameTe: string;
  locationNameHi: string;
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  forecast: DayForecast[];
  agriSummaryEn: string;
  agriSummaryTa: string;
  agriSummaryTe: string;
  agriSummaryHi: string;
}

export function interpretWeatherCode(code: number): {
  en: string;
  ta: string;
  te: string;
  hi: string;
  icon: string;
} {
  switch (code) {
    case 0:
      return { en: 'Clear Sky / Sunny', ta: 'தெளிவான வானம் / வெயில்', te: 'నిర్మలమైన ఆకాశం / ఎండ', hi: 'साफ़ आसमान / धूप', icon: '☀️' };
    case 1:
      return { en: 'Mainly Clear', ta: 'பெரும்பாலும் தெளிவான வானம்', te: 'ఎక్కువగా నిర్మలంగా ఉంది', hi: 'मुख्यतः साफ़', icon: '🌤️' };
    case 2:
      return { en: 'Partly Cloudy', ta: 'பகுதி மேகமூட்டம்', te: 'పాక్షిక మేఘావృతం', hi: 'आंशिक रूप से बादल', icon: '⛅' };
    case 3:
      return { en: 'Overcast', ta: 'முழு மேகமூட்டம்', te: 'పూర్తి మేఘావృతం', hi: 'घने बादल', icon: '☁️' };
    case 45:
    case 48:
      return { en: 'Fog / Mist', ta: 'மூடுபனி', te: 'మంచు / పొగమంచు', hi: 'कोहरा / धुंध', icon: '🌫️' };
    case 51:
    case 53:
    case 55:
      return { en: 'Light Drizzle', ta: 'லேசான தூறல்', te: 'తేలికపాటి జల్లులు', hi: 'हल्की बूंदाबांदी', icon: '🌦️' };
    case 61:
      return { en: 'Slight Rain', ta: 'லேசான மழை', te: 'తేలికపాటి వర్షం', hi: 'हल्की बारिश', icon: '🌧️' };
    case 63:
      return { en: 'Moderate Rain', ta: 'மிதமான மழை', te: 'మోస్తరు వర్షం', hi: 'मध्यम बारिश', icon: '🌧️' };
    case 65:
      return { en: 'Heavy Rain', ta: 'கனமழை', te: 'భారీ వర్షం', hi: 'भारी बारिश', icon: '⛈️' };
    case 80:
    case 81:
    case 82:
      return { en: 'Passing Rain Showers', ta: 'விட்டு விட்டு பெய்யும் மழை', te: 'అడపాదడపా వర్షం', hi: 'रुक-रुक कर बारिश', icon: '🌦️' };
    case 95:
    case 96:
    case 99:
      return { en: 'Thunderstorm', ta: 'இடியுடன் கூடிய பலத்த மழை', te: 'ఉరుములు మెరుపులతో కూడిన వర్షం', hi: 'गरज-चमक के साथ बारिश', icon: '🌩️' };
    default:
      return { en: 'Fair Weather', ta: 'சீரான வானிலை', te: 'అనుకూల వాతావరణం', hi: 'अनुकूल मौसम', icon: '🌤️' };
  }
}

const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_TA = ['ஞாயிறு', 'திங்கள்', 'செவ்வாய்', 'புதன்', 'வியாழன்', 'வெள்ளி', 'சனி'];
const DAYS_TE = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];
const DAYS_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

export async function fetchWeather(
  lat: number,
  lon: number,
  customNameEn?: string,
  customNameTa?: string,
  customNameTe?: string,
  customNameHi?: string
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=5`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch weather data from service');
  }

  const data = await response.json();
  const currentInfo = interpretWeatherCode(data.current.weather_code);

  const current: CurrentWeather = {
    temperature: Math.round(data.current.temperature_2m),
    feelsLike: Math.round(data.current.apparent_temperature),
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    weatherCode: data.current.weather_code,
    conditionEn: currentInfo.en,
    conditionTa: currentInfo.ta,
    conditionTe: currentInfo.te,
    conditionHi: currentInfo.hi,
    icon: currentInfo.icon,
    isDay: data.current.is_day === 1,
    time: data.current.time,
  };

  const daily = data.daily;
  const forecast: DayForecast[] = [];

  for (let i = 0; i < daily.time.length; i++) {
    const dateStr = daily.time[i];
    const dateObj = new Date(dateStr + 'T00:00:00');
    const dayOfWeek = dateObj.getDay();

    const dayNameEn = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : DAYS_EN[dayOfWeek];
    const dayNameTa = i === 0 ? 'இன்று' : i === 1 ? 'நாளை' : DAYS_TA[dayOfWeek];
    const dayNameTe = i === 0 ? 'ఈ రోజు' : i === 1 ? 'రేపు' : DAYS_TE[dayOfWeek];
    const dayNameHi = i === 0 ? 'आज' : i === 1 ? 'कल' : DAYS_HI[dayOfWeek];

    const wCode = daily.weather_code[i];
    const info = interpretWeatherCode(wCode);
    const rainMm = daily.precipitation_sum[i] || 0;
    const rainProb = daily.precipitation_probability_max[i] || 0;
    const maxWind = Math.round(daily.wind_speed_10m_max[i] || 0);

    // Agricultural rules for spray & irrigation
    let sprayAdvisoryEn = 'Good Window';
    let sprayAdvisoryTa = 'தெளிக்க உகந்தது';
    let sprayAdvisoryTe = 'పిచికారీకి అనుకూలం';
    let sprayAdvisoryHi = 'छिड़काव के लिए उपयुक्त';

    if (rainProb >= 50 || rainMm >= 3) {
      sprayAdvisoryEn = 'Avoid (Rain)';
      sprayAdvisoryTa = 'தவிர்க்கவும் (மழை)';
      sprayAdvisoryTe = 'వాయిదా వేయండి (వర్షం)';
      sprayAdvisoryHi = 'टालें (बारिश की संभावना)';
    } else if (maxWind >= 20) {
      sprayAdvisoryEn = 'Caution (Wind)';
      sprayAdvisoryTa = 'எச்சரிக்கை (காற்று)';
      sprayAdvisoryTe = 'జాగ్రత్త (ఎక్కువ గాలి)';
      sprayAdvisoryHi = 'सावधानी (तेज हवा)';
    }

    let irrigationAdvisoryEn = 'Irrigate Normally';
    let irrigationAdvisoryTa = 'வழக்கம் போல் பாய்ச்சலாம்';
    let irrigationAdvisoryTe = 'సాధారణంగా నీరు పెట్టవచ్చు';
    let irrigationAdvisoryHi = 'सामान्य सिंचाई करें';

    if (rainProb >= 60 || rainMm >= 5) {
      irrigationAdvisoryEn = 'Delay (Rain Expected)';
      irrigationAdvisoryTa = 'மழை வாய்ப்பு: தள்ளிப்போடவும்';
      irrigationAdvisoryTe = 'ఆపండి (వర్షం కురిసే అవకాశం)';
      irrigationAdvisoryHi = 'रोकें (बारिश की संभावना)';
    } else if (daily.temperature_2m_max[i] >= 37) {
      irrigationAdvisoryEn = 'Heavy Heat: Irrigate';
      irrigationAdvisoryTa = 'அதிக வெப்பம்: நீர் பாய்ச்சவும்';
      irrigationAdvisoryTe = 'ఎండ తీవ్రత: నీరు పారించండి';
      irrigationAdvisoryHi = 'तेज धूप: पर्याप्त सिंचाई करें';
    }

    forecast.push({
      date: dateStr,
      dayNameEn,
      dayNameTa,
      dayNameTe,
      dayNameHi,
      tempMax: Math.round(daily.temperature_2m_max[i]),
      tempMin: Math.round(daily.temperature_2m_min[i]),
      precipitationSum: Number(rainMm.toFixed(1)),
      precipitationProb: rainProb,
      windSpeedMax: maxWind,
      weatherCode: wCode,
      conditionEn: info.en,
      conditionTa: info.ta,
      conditionTe: info.te,
      conditionHi: info.hi,
      icon: info.icon,
      sprayAdvisoryEn,
      sprayAdvisoryTa,
      sprayAdvisoryTe,
      sprayAdvisoryHi,
      irrigationAdvisoryEn,
      irrigationAdvisoryTa,
      irrigationAdvisoryTe,
      irrigationAdvisoryHi,
    });
  }

  const rainyDays = forecast.filter(f => f.precipitationProb >= 50);
  let agriSummaryEn = '';
  let agriSummaryTa = '';
  let agriSummaryTe = '';
  let agriSummaryHi = '';

  if (rainyDays.length > 0) {
    const rainDayNamesEn = rainyDays.map(d => d.dayNameEn).join(', ');
    const rainDayNamesTa = rainyDays.map(d => d.dayNameTa).join(', ');
    const rainDayNamesTe = rainyDays.map(d => d.dayNameTe).join(', ');
    const rainDayNamesHi = rainyDays.map(d => d.dayNameHi).join(', ');
    
    agriSummaryEn = `Rain likely on ${rainDayNamesEn}. Delay pesticide spraying and heavy irrigation to prevent wash-off and waterlogging.`;
    agriSummaryTa = `${rainDayNamesTa} நாட்களில் மழை பெய்ய வாய்ப்புள்ளது. மருந்து தெளிப்பதை தவிர்க்கவும்; பாசனத்தை தள்ளி வைக்கவும்.`;
    agriSummaryTe = `${rainDayNamesTe} రోజుల్లో వర్షం కురిసే అవకాశం ఉంది. మందుల పిచికారీని వాయిదా వేయండి మరియు నీటి పారుదలను నిలిపివేయండి.`;
    agriSummaryHi = `${rainDayNamesHi} को बारिश की संभावना है। कीटनाशक छिड़काव और भारी सिंचाई टालें ताकि दवा न धुले।`;
  } else {
    agriSummaryEn = `Favorable dry weather for the next 5 days. Good conditions for foliar nutrient spraying, weeding, and normal irrigation.`;
    agriSummaryTa = `அடுத்த 5 நாட்களுக்கு வறண்ட சீரான வானிலை நிலவும். உரம் தெளிக்கவும், களை எடுக்கவும், பாசனம் செய்யவும் உகந்த சூழல்.`;
    agriSummaryTe = `రాబోయే 5 రోజులు పొడి మరియు అనుకూల వాతావరణం ఉంటుంది. ఎరువుల పిచికారీ, కలుపు తీత మరియు సాధారణ నీటి పారుదలకు అనువైన సమయం.`;
    agriSummaryHi = `अगले 5 दिनों तक अनुकूल मौसम रहेगा। पर्णीय पोषण छिड़काव, निराई-गुड़ाई और सामान्य सिंचाई के लिए उत्तम समय है।`;
  }

  return {
    locationNameEn: customNameEn || 'Selected Location',
    locationNameTa: customNameTa || 'தேர்ந்தெடுக்கப்பட்ட பகுதி',
    locationNameTe: customNameTe || 'ఎంచుకున్న ప్రాంతం',
    locationNameHi: customNameHi || 'चुना गया स्थान',
    latitude: lat,
    longitude: lon,
    current,
    forecast,
    agriSummaryEn,
    agriSummaryTa,
    agriSummaryTe,
    agriSummaryHi,
  };
}

export function getDistrictLabel(district: District, language: Language): string {
  if (language === 'ta') return `${district.nameTa} (${district.stateTa})`;
  if (language === 'te') return `${district.nameTe} (${district.stateTe})`;
  if (language === 'hi') return `${district.nameHi} (${district.stateHi})`;
  return `${district.nameEn} (${district.stateEn})`;
}

export function getWeatherCondition(w: { conditionEn: string; conditionTa: string; conditionTe?: string; conditionHi?: string }, language: Language): string {
  if (language === 'ta') return w.conditionTa;
  if (language === 'te') return w.conditionTe || w.conditionEn;
  if (language === 'hi') return w.conditionHi || w.conditionEn;
  return w.conditionEn;
}

export function getDayName(d: { dayNameEn: string; dayNameTa: string; dayNameTe?: string; dayNameHi?: string }, language: Language): string {
  if (language === 'ta') return d.dayNameTa;
  if (language === 'te') return d.dayNameTe || d.dayNameEn;
  if (language === 'hi') return d.dayNameHi || d.dayNameEn;
  return d.dayNameEn;
}

export function getSprayAdvisory(d: { sprayAdvisoryEn: string; sprayAdvisoryTa: string; sprayAdvisoryTe?: string; sprayAdvisoryHi?: string }, language: Language): string {
  if (language === 'ta') return d.sprayAdvisoryTa;
  if (language === 'te') return d.sprayAdvisoryTe || d.sprayAdvisoryEn;
  if (language === 'hi') return d.sprayAdvisoryHi || d.sprayAdvisoryEn;
  return d.sprayAdvisoryEn;
}

export function getIrrigationAdvisory(d: { irrigationAdvisoryEn: string; irrigationAdvisoryTa: string; irrigationAdvisoryTe?: string; irrigationAdvisoryHi?: string }, language: Language): string {
  if (language === 'ta') return d.irrigationAdvisoryTa;
  if (language === 'te') return d.irrigationAdvisoryTe || d.irrigationAdvisoryEn;
  if (language === 'hi') return d.irrigationAdvisoryHi || d.irrigationAdvisoryEn;
  return d.irrigationAdvisoryEn;
}
