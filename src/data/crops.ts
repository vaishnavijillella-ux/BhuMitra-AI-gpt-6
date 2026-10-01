import { Language } from './translations';

export interface Crop {
  id: string;
  nameEn: string;
  nameTa: string;
  nameTe: string;
  nameHi: string;
  icon: string;
  category: 'cereal' | 'vegetable' | 'cash_crop' | 'fruit' | 'oilseed';
  categoryLabelEn: string;
  categoryLabelTa: string;
  categoryLabelTe: string;
  categoryLabelHi: string;
  seasonEn: string;
  seasonTa: string;
  seasonTe: string;
  seasonHi: string;
  waterNeed: 'Low' | 'Medium' | 'High';
  waterNeedTa: 'குறைவு' | 'நடுத்தரம்' | 'அதிகம்';
  waterNeedTe: 'తక్కువ' | 'మధ్యస్థం' | 'అధికం';
  waterNeedHi: 'कम' | 'मध्यम' | 'अधिक';
  quickQuestions: {
    en: string[];
    ta: string[];
    te: string[];
    hi: string[];
  };
}

export const CROPS: Crop[] = [
  {
    id: 'paddy',
    nameEn: 'Paddy / Rice',
    nameTa: 'நெல்',
    nameTe: 'వరి / ధాన్యం',
    nameHi: 'धान / चावल',
    icon: '🌾',
    category: 'cereal',
    categoryLabelEn: 'Cereal Grain',
    categoryLabelTa: 'தானியம்',
    categoryLabelTe: 'ధాన్యం',
    categoryLabelHi: 'अनाज',
    seasonEn: 'Kharif & Rabi (Kuruvai / Samba)',
    seasonTa: 'குருவை / சம்பா',
    seasonTe: 'ఖరీఫ్ & రబీ (సార్వా / దాళ్వా)',
    seasonHi: 'खरीफ और रबी',
    waterNeed: 'High',
    waterNeedTa: 'அதிகம்',
    waterNeedTe: 'అధికం',
    waterNeedHi: 'अधिक',
    quickQuestions: {
      en: [
        'How to control stem borer and leaf folder naturally?',
        'What is the ideal N-P-K fertilizer schedule for 1 acre?',
        'How to identify and cure blast disease in paddy?',
        'Best water management techniques for SRI method?'
      ],
      ta: [
        'தண்டு துளைப்பான் மற்றும் இலை சுருட்டுப் புழுவை கட்டுப்படுத்துவது எப்படி?',
        'நெல் பயிருக்கு ஏக்கருக்கு பரிந்துரைக்கப்படும் உர அளவு என்ன?',
        'குலைநோய் (பிளாஸ்ட்) அறிகுறிகள் மற்றும் இயற்கை சிகிச்சை என்ன?',
        'செம்மை நெல் சாகுபடியில் (SRI) நீர் மேலாண்மை முறைகள் என்ன?'
      ],
      te: [
        'వరిలో కాండం తొలుచు పురుగు మరియు ఆకుచుట్టు పురుగు నివారణ ఎలా?',
        'ఎకరానికి సిఫార్సు చేసిన N-P-K ఎరువుల మోతాదు ఎంత?',
        'అగ్గి తెగులు (బ్లాస్ట్) లక్షణాలు మరియు నివారణ పద్ధతులు ఏమిటి?',
        'శ్రీ పద్ధతి (SRI) సాగులో సరైన నీటి యాజమాన్యం ఏమిటి?'
      ],
      hi: [
        'धान में तना छेदक और पत्ता लपेटक कीट का जैविक नियंत्रण कैसे करें?',
        'धान के लिए प्रति एकड़ अनुशंसित एन-पी-के खाद का सही समय क्या है?',
        'धान में झुलसा (ब्लास्ट) रोग के लक्षण और उपचार क्या हैं?',
        'कम पानी में धान की खेती के लिए श्री विधि की तकनीकें क्या हैं?'
      ]
    }
  },
  {
    id: 'tomato',
    nameEn: 'Tomato',
    nameTa: 'தக்காளி',
    nameTe: 'టమాటా',
    nameHi: 'टमाटर',
    icon: '🍅',
    category: 'vegetable',
    categoryLabelEn: 'Vegetable',
    categoryLabelTa: 'காய்கறி',
    categoryLabelTe: 'కూరగాయ',
    categoryLabelHi: 'सब्जी',
    seasonEn: 'Year-round (Best: Oct - Feb)',
    seasonTa: 'ஆண்டு முழுவதும் (அக் - பிப்)',
    seasonTe: 'సంవత్సరమంతా (అక్టోబర్ - ఫిబ్రవరి అనుకూలం)',
    seasonHi: 'साल भर (अक्टूबर - फरवरी सर्वोत्तम)',
    waterNeed: 'Medium',
    waterNeedTa: 'நடுத்தரம்',
    waterNeedTe: 'మధ్యస్థం',
    waterNeedHi: 'मध्यम',
    quickQuestions: {
      en: [
        'Why are tomato leaves curling and turning yellow?',
        'How to prevent fruit borer caterpillars organically?',
        'What fertilizer increases flower bloom and stops fruit drop?',
        'How often should I irrigate tomato crops using drip?'
      ],
      ta: [
        'தக்காளி இலைகள் ஏன் சுருண்டு மஞ்சள் நிறமாக மாறுகிறது?',
        'காய் துளைப்பான் புழுவை இயற்கை முறையில் கட்டுப்படுத்துவது எப்படி?',
        'பூ உதிர்வதைத் தடுத்து அதிக காய்கள் பிடிக்க என்ன செய்ய வேண்டும்?',
        'சொட்டு நீர் பாசனத்தில் தக்காளிக்கு எத்தனை நாட்களுக்கு ஒருமுறை தண்ணீர் பாய்ச்ச வேண்டும்?'
      ],
      te: [
        'టమాటా ఆకులు ఎందుకు ముడుచుకుపోతున్నాయి మరియు పసుపు రంగులోకి మారుతున్నాయి?',
        'కాయ తొలుచు పురుగును సేంద్రీయ పద్ధతిలో ఎలా నివారించాలి?',
        'పూత రాలకుండా ఎక్కువ కాయలు కాయడానికి ఏమి చేయాలి?',
        'డ్రిప్ పద్ధతిలో టమాటాకు ఎన్ని రోజులకు ఒకసారి నీరు పెట్టాలి?'
      ],
      hi: [
        'टमाटर की पत्तियां क्यों मुड़ रही हैं और पीली पड़ रही हैं?',
        'फल छेदक इल्ली की रोकथाम जैविक तरीके से कैसे करें?',
        'फूलों को झड़ने से रोकने और अधिक फल के लिए कौन सी खाद डालें?',
        'टपक सिंचाई (ड्रिप) से टमाटर को कितने दिन बाद पानी देना चाहिए?'
      ]
    }
  },
  {
    id: 'cotton',
    nameEn: 'Cotton',
    nameTa: 'பருத்தி',
    nameTe: 'ప్రత్తి (పత్తి)',
    nameHi: 'कपास',
    icon: '☁️',
    category: 'cash_crop',
    categoryLabelEn: 'Cash Crop',
    categoryLabelTa: 'பணப்பயிர்',
    categoryLabelTe: 'వాణిజ్య పంట',
    categoryLabelHi: 'नकदी फसल',
    seasonEn: 'Kharif (June - Nov)',
    seasonTa: 'மானாவாரி / காரீப் (ஜூன் - நவ)',
    seasonTe: 'ఖరీఫ్ (జూన్ - నవంబర్)',
    seasonHi: 'खरीफ (जून - नवंबर)',
    waterNeed: 'Medium',
    waterNeedTa: 'நடுத்தரம்',
    waterNeedTe: 'మధ్యస్థం',
    waterNeedHi: 'मध्यम',
    quickQuestions: {
      en: [
        'How to manage pink bollworm in cotton?',
        'What organic trap crops protect cotton from sucking pests?',
        'How to prevent leaf reddening and magnesium deficiency?',
        'Best foliar spray to boost boll weight and quality?'
      ],
      ta: [
        'பருத்தியில் இளஞ்சிவப்பு காய்ப்புழுவை எப்படி கட்டுப்படுத்துவது?',
        'சாறு உறிஞ்சும் பூச்சிகளை விரட்ட என்ன கவர்ச்சிப் பயிர் நட வேண்டும்?',
        'பருத்தி இலைகள் சிவப்பாக மாறுவதை தடுப்பது எப்படி?',
        'பருத்தி காய்களின் எடை மற்றும் தரத்தை உயர்த்த சிறந்த இலைவழி தெளிப்பு எது?'
      ],
      te: [
        'పత్తిలో గులాబీ రంగు కాయ తొలుచు పురుగు నివారణ ఎలా?',
        'రసం పీల్చే పురుగుల నివారణకు ఎలాంటి ఎర పంటలు వేయాలి?',
        'పత్తి ఆకులు ఎర్రబారకుండా ఉండటానికి ఏమి పిచికారీ చేయాలి?',
        'కాయ సైజు మరియు నాణ్యత పెంచడానికి ఉత్తమ పిచికారీ ఏది?'
      ],
      hi: [
        'कपास में गुलाबी सुंडी (पिंक बॉलवर्म) का नियंत्रण कैसे करें?',
        'रस चूसक कीटों से बचाव के लिए कौन सी ट्रैप फसल लगाएं?',
        'कपास में पत्तियों का लाल होना और मैग्नीशियम की कमी कैसे दूर करें?',
        'टिंडों के वजन और कपास की गुणवत्ता बढ़ाने के लिए क्या स्प्रे करें?'
      ]
    }
  },
  {
    id: 'sugarcane',
    nameEn: 'Sugarcane',
    nameTa: 'கரும்பு',
    nameTe: 'చెరకు',
    nameHi: 'गन्ना',
    icon: '🎋',
    category: 'cash_crop',
    categoryLabelEn: 'Cash Crop',
    categoryLabelTa: 'பணப்பயிர்',
    categoryLabelTe: 'వాణిజ్య పంట',
    categoryLabelHi: 'नकदी फसल',
    seasonEn: 'Dec - March Planting (Annual)',
    seasonTa: 'டிசம்பர் - மார்ச் நடவு',
    seasonTe: 'డిసెంబర్ - మార్చి నాట్లు (వార్షిక పంట)',
    seasonHi: 'दिसंबर - मार्च रोपाई (वार्षिक)',
    waterNeed: 'High',
    waterNeedTa: 'அதிகம்',
    waterNeedTe: 'అధికం',
    waterNeedHi: 'अधिक',
    quickQuestions: {
      en: [
        'How to tackle early shoot borer in sugarcane shoots?',
        'What are the signs of red rot disease and how to prevent it?',
        'Best organic trash mulching method for moisture retention?',
        'How to increase sugar recovery and cane girth?'
      ],
      ta: [
        'கரும்பில் குருத்து துளைப்பானை எவ்வாறு அழிப்பது?',
        'செவ்வழுகல் நோயின் அறிகுறிகள் மற்றும் தடுப்பு முறை என்ன?',
        'ஈரப்பதத்தை தக்கவைக்க கரும்பு சோகை மூடாக்கு முறை எப்படி செய்வது?',
        'கரும்பின் பருமன் மற்றும் சர்க்கரை அளவை அதிகரிக்க என்ன உரம் தேவை?'
      ],
      te: [
        'చెరకులో మువ్వ తొలుచు పురుగును ఎలా అరికట్టాలి?',
        'ఎర్ర కుళ్లు తెగులు లక్షణాలు మరియు నివారణ మార్గాలు ఏమిటి?',
        'తేమను కాపాడటానికి చెరకు ఆకులతో మల్చింగ్ ఎలా చేయాలి?',
        'చెరకు లావు మరియు చక్కెర శాతం పెరగడానికి ఏమి వాడాలి?'
      ],
      hi: [
        'गन्ने में तना छेदक कीट की रोकथाम कैसे करें?',
        'लाल सड़न (रेड रॉट) रोग की पहचान और रोकथाम क्या है?',
        'नमी बनाए रखने के लिए गन्ने की सूखी पत्तियों से मल्चिंग कैसे करें?',
        'गन्ने की मोटाई और वजन बढ़ाने के लिए कौन सा खाद डालें?'
      ]
    }
  },
  {
    id: 'banana',
    nameEn: 'Banana',
    nameTa: 'வாழை',
    nameTe: 'అరటి',
    nameHi: 'केला',
    icon: '🍌',
    category: 'fruit',
    categoryLabelEn: 'Fruit Crop',
    categoryLabelTa: 'பழப்பயிர்',
    categoryLabelTe: 'పండ్ల తోట',
    categoryLabelHi: 'फल',
    seasonEn: 'Throughout Year (Feb - May ideal)',
    seasonTa: 'ஆண்டு முழுவதும் (பிப்ரவரி - மே)',
    seasonTe: 'సంవత్సరమంతా (ఫిబ్రవరి - మే అనుకూలం)',
    seasonHi: 'साल भर (फरवरी - मई सर्वोत्तम)',
    waterNeed: 'High',
    waterNeedTa: 'அதிகம்',
    waterNeedTe: 'అధికం',
    waterNeedHi: 'अधिक',
    quickQuestions: {
      en: [
        'How to manage Sigatoka leaf spot disease in banana?',
        'What is the treatment for banana pseudostem weevil?',
        'Best organic manure schedule for Grand Naine & Poovan?',
        'How to protect banana bunches from sun scalding and sunburn?'
      ],
      ta: [
        'வாழையில் சிகடோகா இலைப்புள்ளி நோயைக் கட்டுப்படுத்துவது எப்படி?',
        'தண்டு துளைக்கும் கூன்வண்டு தாக்குதலுக்கு தீர்வு என்ன?',
        'நேந்திரன், ஜி9 மற்றும் பூவன் வாழைக்கு சிறந்த உர அட்டவணை என்ன?',
        'வாழை தாரில் காய் பளபளப்பாக வர என்ன உரம் தெளிக்க வேண்டும்?'
      ],
      te: [
        'అరటిలో సిగటోకా ఆకుమచ్చ తెగులు నివారణ ఎలా?',
        'అరటి దుంప మరియు కాండం తొలిచే పురుగు నివారణకు మందు ఏమిటి?',
        'గ్రాండ్ నైన్ మరియు అమృతపాణి అరటికి ఉత్తమ ఎరువుల షెడ్యూల్ ఏమిటి?',
        'అరటి గెలలు మంచి బరువు మరియు సైజు రావడానికి ఏమి పిచికారీ చేయాలి?'
      ],
      hi: [
        'केले में सिगाटोका पत्ती धब्बा रोग का उपचार कैसे करें?',
        'केले के तना छेदक घुन (वीविल) का प्रभावी नियंत्रण क्या है?',
        'जी9 केले के लिए जैविक खाद एवं पोषक तत्वों का सही समय क्या है?',
        'केले के घहर को धूप और कीटों से बचाने के उपाय क्या हैं?'
      ]
    }
  },
  {
    id: 'chili',
    nameEn: 'Chili / Pepper',
    nameTa: 'மிளகாய்',
    nameTe: 'మిరప',
    nameHi: 'मिर्च',
    icon: '🌶️',
    category: 'vegetable',
    categoryLabelEn: 'Spice & Vegetable',
    categoryLabelTa: 'மசாலா & காய்கறி',
    categoryLabelTe: 'కూరగాయ & మసాలా',
    categoryLabelHi: 'सब्जी एवं मसाला',
    seasonEn: 'June - July & Oct - Nov',
    seasonTa: 'ஜூன் - ஜூலை & அக் - நவ',
    seasonTe: 'జూన్ - జూలై & అక్టోబర్ - నవంబర్',
    seasonHi: 'जून - जुलाई और अक्टूबर - नवंबर',
    waterNeed: 'Medium',
    waterNeedTa: 'நடுத்தரம்',
    waterNeedTe: 'మధ్యస్థం',
    waterNeedHi: 'मध्यम',
    quickQuestions: {
      en: [
        'How to control thrips and mites causing leaf curl (Murukku disease)?',
        'Natural fermented sprays to induce heavy chili flowering?',
        'How to cure anthracnose (die-back / fruit rot) in chili?',
        'What is the best spacing and irrigation for high yield?'
      ],
      ta: [
        'மிளகாயில் இலை சுருட்டை (முறுக்கு நோய்) மற்றும் அசுவினி பூச்சிக்கு மருந்து என்ன?',
        'மிளகாய் செடியில் அதிக பூக்கள் பூக்க என்ன இயற்கை உரம் தெளிப்பது?',
        'நுனிக் கருகல் மற்றும் காய் அழுகல் நோயை குணப்படுத்துவது எப்படி?',
        'மிளகாய் சாகுபடியில் அதிக விளைச்சலுக்கு இடைவெளி மற்றும் நீர் நிர்வாகம் என்ன?'
      ],
      te: [
        'మిరపలో బొబ్బర / ఆకు ముడుత తెగులు నివారణకు పరిష్కారం ఏమిటి?',
        'మిరపలో విపరీతమైన పూత మరియు కాయ రావడానికి సేంద్రీయ ద్రావణాలు ఏవి?',
        'కొమ్మ ఎండు మరియు కాయ కుళ్లు తెగులును ఎలా నయం చేయాలి?',
        'అధిక దిగుబడికి మొక్కల మధ్య దూరం మరియు నీటి యాజమాన్యం ఎలా ఉండాలి?'
      ],
      hi: [
        'मिर्च में चुर्रा-मुर्रा (पत्ती मरोड़) रोग और थ्रिप्स का पक्का इलाज क्या है?',
        'मिर्च में भारी फूल और फल लाने के लिए कौन सा जैविक टॉनिक दें?',
        'मिर्च में डाई-बैक (ऊपर से सूखना) और फल सड़न की रोकथाम कैसे करें?',
        'अधिक मिर्च पैदावार के लिए सही सिंचाई और दूरी क्या होनी चाहिए?'
      ]
    }
  },
  {
    id: 'groundnut',
    nameEn: 'Groundnut',
    nameTa: 'வேர்க்கடலை / நிலக்கடலை',
    nameTe: 'వేరుశనగ',
    nameHi: 'मूंगफली',
    icon: '🥜',
    category: 'oilseed',
    categoryLabelEn: 'Oilseed',
    categoryLabelTa: 'எண்ணெய் வித்து',
    categoryLabelTe: 'నూనె గింజ',
    categoryLabelHi: 'तिलहन',
    seasonEn: 'Kharif (June - July) & Rabi (Nov - Dec)',
    seasonTa: 'சித்திரை / கார்த்திகை பட்டம்',
    seasonTe: 'ఖరీఫ్ (జూన్ - జూలై) & రబీ (నవంబర్ - డిసెంబర్)',
    seasonHi: 'खरीफ (जून - जुलाई) और रबी (नवंबर - दिसंबर)',
    waterNeed: 'Low',
    waterNeedTa: 'குறைவு',
    waterNeedTe: 'తక్కువ',
    waterNeedHi: 'कम',
    quickQuestions: {
      en: [
        'When should gypsum be applied for groundnut pod filling?',
        'How to prevent Tikka leaf spot disease organically?',
        'How to control red hairy caterpillar and white grub?',
        'What micronutrient spray prevents empty shells (pops)?'
      ],
      ta: [
        'நிலக்கடலைக்கு ஜிப்சம் எந்த நாளில் இட வேண்டும்?',
        'டிக்கா இலைப்புள்ளி நோயை இயற்கை முறையில் தடுப்பது எப்படி?',
        'வேர்ப்புழு மற்றும் சிவப்பு கம்பளிப் புழுவை அழிக்க வழி என்ன?',
        'காய் திரட்சியாக வரவும் பதர் விழுவதைத் தடுக்கவும் என்ன தெளிக்க வேண்டும்?'
      ],
      te: [
        'వేరుశనగ కాయ గట్టిపడటానికి జిప్సం ఎప్పుడు వేయాలి?',
        'టిక్కా ఆకుమచ్చ తెగులును సేంద్రీయంగా ఎలా నివారించాలి?',
        'వేరు పురుగు మరియు ఎర్ర గొంగళి పురుగు నివారణ ఎలా?',
        'బోలు కాయలు రాకుండా గింజ బరువు పెరగడానికి ఏమి పిచికారీ చేయాలి?'
      ],
      hi: [
        'मूंगफली में दाना भराव के लिए जिप्सम कब डालना चाहिए?',
        'टिक्का पत्ती धब्बा रोग का जैविक समाधान क्या है?',
        'सफेद लट (व्हाइट ग्रब) और दीमक से मूंगफली को कैसे बचाएं?',
        'खाली फलियों (पॉप्स) से बचने के लिए कौन सा सूक्ष्म पोषक तत्व छिड़कें?'
      ]
    }
  },
  {
    id: 'maize',
    nameEn: 'Maize / Corn',
    nameTa: 'மக்காச்சோளம்',
    nameTe: 'మొక్కజొన్న',
    nameHi: 'मक्का',
    icon: '🌽',
    category: 'cereal',
    categoryLabelEn: 'Cereal Grain',
    categoryLabelTa: 'தானியம்',
    categoryLabelTe: 'ధాన్యం',
    categoryLabelHi: 'अनाज',
    seasonEn: 'Kharif & Rabi (Year round with water)',
    seasonTa: 'ஆடி & கார்த்திகை பட்டம்',
    seasonTe: 'ఖరీఫ్ & రబీ (నీటి వసతితో ఏడాది పొడవునా)',
    seasonHi: 'खरीफ एवं रबी (पानी की सुविधा पर साल भर)',
    waterNeed: 'Medium',
    waterNeedTa: 'நடுத்தரம்',
    waterNeedTe: 'మధ్యస్థం',
    waterNeedHi: 'मध्यम',
    quickQuestions: {
      en: [
        'How to manage Fall Armyworm (FAW) caterpillar in maize whorls?',
        'What is the critical stage of water requirement for maize cob formation?',
        'Recommended bio-control agents against corn stem borer?',
        'How to correct zinc deficiency causing white bud in young maize?'
      ],
      ta: [
        'மக்காச்சோளத்தில் படைப்புழுவை (Fall Armyworm) கட்டுப்படுத்த சிறந்த வழி என்ன?',
        'மக்காச்சோளத்தில் கதிர் உருவாகும் போது நீர் பாசனம் எப்படி இருக்க வேண்டும்?',
        'மக்காச்சோளத் தண்டு துளைப்பானுக்கு உயிரியல் தீர்வு என்ன?',
        'இளம் மக்காச்சோளத்தில் துத்தநாகக் குறைபாட்டால் இலை வெளுப்பதை சரிசெய்வது எப்படி?'
      ],
      te: [
        'మొక్కజొన్నలో కత్తెర పురుగు (Fall Armyworm) నివారణకు ఉత్తమ మార్గం ఏమిటి?',
        'కంకి పాలుపోసుకునే దశలో నీటి అవసరం ఎలా ఉంటుంది?',
        'మొక్కజొన్న కాండం తొలిచే పురుగుకు జీవ నియంత్రణ పద్ధతులు ఏమిటి?',
        'జింక్ లోపం వల్ల ఆకులు తెల్లబడటాన్ని ఎలా సరిచేయాలి?'
      ],
      hi: [
        'मक्के में फॉल आर्मीवर्म (सैनिक कीट) का सबसे असरदार इलाज क्या है?',
        'मक्के में भुट्टा बनते समय पानी की आवश्यकता कब होती है?',
        'मक्का तना छेदक के लिए ट्राइकोग्रामा मित्र कीट का उपयोग कैसे करें?',
        'मक्के में सफेद कली (जिंक की कमी) की पहचान और समाधान क्या है?'
      ]
    }
  },
  {
    id: 'onion',
    nameEn: 'Onion / Shallot',
    nameTa: 'வெங்காயம் / சின்ன வெங்காயம்',
    nameTe: 'ఉల్లిపాయ',
    nameHi: 'प्याज',
    icon: '🧅',
    category: 'vegetable',
    categoryLabelEn: 'Vegetable',
    categoryLabelTa: 'காய்கறி',
    categoryLabelTe: 'కూరగాయ',
    categoryLabelHi: 'सब्जी',
    seasonEn: 'April - May & Oct - Nov',
    seasonTa: 'சித்திரை & ஐப்பசி பட்டம்',
    seasonTe: 'ఏప్రిల్ - మే & అక్టోబర్ - నవంబర్',
    seasonHi: 'अप्रैल - मई और अक्टूबर - नवंबर',
    waterNeed: 'Medium',
    waterNeedTa: 'நடுத்தரம்',
    waterNeedTe: 'మధ్యస్థం',
    waterNeedHi: 'मध्यम',
    quickQuestions: {
      en: [
        'How to cure purple blotch disease in onion leaves?',
        'What fertilizer helps small onions (shallots) grow bigger bulbs?',
        'How to control thrips hiding between inner leaf folds?',
        'When to stop irrigation before harvesting onions for long shelf life?'
      ],
      ta: [
        'வெங்காயத்தில் சாம்பல் நோய் மற்றும் கருகல் நோய்க்கு என்ன தீர்வு?',
        'சின்ன வெங்காயம் உருண்டையாக பருக்க என்ன உரம் இட வேண்டும்?',
        'வெங்காய இலை இடுக்கில் இருக்கும் இலைப்பேன் பூச்சியை அழிப்பது எப்படி?',
        'வெங்காயம் அழுகாமல் நீண்ட நாள் சேமிக்க அறுவடைக்கு முன் என்ன செய்ய வேண்டும்?'
      ],
      te: [
        'ఉల్లి ఆకుమచ్చ మరియు ఆకు మాడ తెగులు నివారణ ఎలా?',
        'ఉల్లిపాయలు పెద్ద సైజులో దిట్టంగా రావడానికి ఏ ఎరువు వాడాలి?',
        'ఆకుల సందుల్లో దాగి ఉండే తామర పురుగులను ఎలా అరికట్టాలి?',
        'ఉల్లిపాయలు కుళ్లిపోకుండా ఎక్కువ కాలం నిల్వ ఉండాలంటే ఎప్పుడు కోయాలి?'
      ],
      hi: [
        'प्याज में बैंगनी धब्बा (पर्पल ब्लॉच) और झुलसा रोग का उपचार क्या है?',
        'प्याज की गांठों का आकार बड़ा और चमकदार बनाने के लिए क्या डालें?',
        'पत्तियों के अंदर छिपे थ्रिप्स कीट की रोकथाम कैसे करें?',
        'लंबे समय तक प्याज के सुरक्षित भंडारण के लिए कटाई पूर्व क्या करें?'
      ]
    }
  },
  {
    id: 'mango',
    nameEn: 'Mango',
    nameTa: 'மாம்பழம்',
    nameTe: 'మామిడి',
    nameHi: 'आम',
    icon: '🥭',
    category: 'fruit',
    categoryLabelEn: 'Fruit Crop',
    categoryLabelTa: 'பழப்பயிர்',
    categoryLabelTe: 'పండ్ల తోట',
    categoryLabelHi: 'फल',
    seasonEn: 'Flowering: Dec - Jan, Harvest: April - June',
    seasonTa: 'பூக்கும் காலம்: டிசம்பர் - ஜனவரி',
    seasonTe: 'పూత కాలం: డిసెంబర్ - జనవరి, కోత: ఏప్రిల్ - జూన్',
    seasonHi: 'बौर का समय: दिसंबर - जनवरी, तुड़ाई: अप्रैल - जून',
    waterNeed: 'Low',
    waterNeedTa: 'குறைவு',
    waterNeedTe: 'తక్కువ',
    waterNeedHi: 'कम',
    quickQuestions: {
      en: [
        'How to protect mango blossoms from hopper pests and powdery mildew?',
        'What causes black spots on mango fruit and how to treat anthracnose?',
        'How to induce uniform flowering in alternate-bearing varieties?',
        'Safe non-chemical fruit fly traps for mango orchards?'
      ],
      ta: [
        'மா பூக்கும் தருணத்தில் தத்துப்பூச்சி மற்றும் சாம்பல் நோயைத் தடுப்பது எப்படி?',
        'மாங்காயில் கருப்பு புள்ளி மற்றும் அழுகல் வராமல் காக்க என்ன செய்ய வேண்டும்?',
        'ஆண்டுதோறும் சீராக மா மரம் பூக்க என்ன சிறப்பு உரம் அளிக்க வேண்டும்?',
        'பழ ஈக்களை கவர்ந்து அழிக்க உதவும் இனக்கவர்ச்சி பொறி தயாரிப்பது எப்படி?'
      ],
      te: [
        'మామిడి పూత సమయంలో తేనె మంచు పురుగు మరియు బూడిద తెగులు నివారణ ఎలా?',
        'కాయలపై నల్లటి మచ్చలు మరియు ఆంత్రాక్నోస్ రాకుండా ఏమి చేయాలి?',
        'ప్రతి సంవత్సరం సమృద్ధిగా పూత రావడానికి ఎలాంటి పోషకాలు ఇవ్వాలి?',
        'పండ్ల ఈగలను ఆకర్షించి చంపే ఎర బుట్టలను ఎలా తయారు చేయాలి?'
      ],
      hi: [
        'आम के बौर को भुनगा (हॉपर) और छाछिया (पाउडरी मिल्ड्यू) से कैसे बचाएं?',
        'आम के फलों पर काले धब्बे और एन्थ्रेक्नोज़ रोग का इलाज क्या है?',
        'आम के पेड़ों में हर साल नियमित फल आने के लिए क्या उपाय करें?',
        'फल मक्खी (फ्रूट फ्लाई) से बचाव के लिए फेरोमोन ट्रैप कैसे लगाएं?'
      ]
    }
  },
  {
    id: 'general',
    nameEn: 'All Crops / General Soil & Water',
    nameTa: 'அனைத்து பயிர்கள் / பொது வேளாண்மை',
    nameTe: 'అన్ని పంటలు / నేల & నీటి యాజమాన్యం',
    nameHi: 'सभी फसलें / सामान्य कृषि एवं मिट्टी',
    icon: '🌱',
    category: 'cereal',
    categoryLabelEn: 'General Agri',
    categoryLabelTa: 'பொது வேளாண்மை',
    categoryLabelTe: 'సాధారణ వ్యవసాయం',
    categoryLabelHi: 'सामान्य कृषि',
    seasonEn: 'Any Season',
    seasonTa: 'அனைத்து பருவம்',
    seasonTe: 'అన్ని కాలాలు',
    seasonHi: 'सभी मौसम',
    waterNeed: 'Medium',
    waterNeedTa: 'நடுத்தரம்',
    waterNeedTe: 'మధ్యస్థం',
    waterNeedHi: 'मध्यम',
    quickQuestions: {
      en: [
        'How to prepare Jeevamrit and Panchagavya organic growth promoters at home?',
        'How to test soil health and reduce soil salinity naturally?',
        'What are the government subsidies available for drip irrigation and solar pumps?',
        'How to make organic neem seed kernel extract (NSKE 5%) spray?'
      ],
      ta: [
        'வீட்டிலேயே ஜீவாமிர்தம் மற்றும் பஞ்சகவ்யா இயற்கை உரங்கள் தயாரிப்பது எப்படி?',
        'மண்ணின் வளத்தை அறிய மண் பரிசோதனை மற்றும் உவர் நிலத்தை சீரமைப்பது எப்படி?',
        'சொட்டு நீர் பாசனம் மற்றும் சூரிய சக்தி பம்புகளுக்கு அரசு மானியம் பெறுவது எப்படி?',
        'இயற்கை முறையில் 5% வேப்பங்கொட்டை கரைசல் தயாரிப்பது எப்படி?'
      ],
      te: [
        'ఇంట్లోనే జీవామృతం మరియు పంచగవ్య తయారీ విధానం ఏమిటి?',
        'నేల ఆరోగ్యం మరియు ఉప్పు భూములను సేంద్రీయంగా ఎలా బాగు చేసుకోవాలి?',
        'బిందు సేద్యం (డ్రిప్) మరియు సోలార్ పంపులకు ప్రభుత్వ రాయితీలు ఏమిటి?',
        'సేంద్రీయ 5% వేప గింజల కషాయం (NSKE) ఎలా తయారు చేయాలి?'
      ],
      hi: [
        'घर पर जीवामृत और पंचगव्य बनाने की आसान विधि क्या है?',
        'मिट्टी की जांच और खारेपन को प्राकृतिक तरीके से कैसे ठीक करें?',
        'ड्रिप सिंचाई और सोलर पंप पर सरकारी सब्सिडी कैसे प्राप्त करें?',
        'नीम की गिरी का 5% काढ़ा (एनएसकेई) घर पर कैसे तैयार करें?'
      ]
    }
  }
];

export function getCropName(crop: Crop, language: Language): string {
  if (language === 'ta') return crop.nameTa;
  if (language === 'te') return crop.nameTe;
  if (language === 'hi') return crop.nameHi;
  return crop.nameEn;
}

export function getCropSeason(crop: Crop, language: Language): string {
  if (language === 'ta') return crop.seasonTa;
  if (language === 'te') return crop.seasonTe;
  if (language === 'hi') return crop.seasonHi;
  return crop.seasonEn;
}

export function getCropWaterNeed(crop: Crop, language: Language): string {
  if (language === 'ta') return crop.waterNeedTa;
  if (language === 'te') return crop.waterNeedTe;
  if (language === 'hi') return crop.waterNeedHi;
  return crop.waterNeed;
}

export function getCropCategory(crop: Crop, language: Language): string {
  if (language === 'ta') return crop.categoryLabelTa;
  if (language === 'te') return crop.categoryLabelTe;
  if (language === 'hi') return crop.categoryLabelHi;
  return crop.categoryLabelEn;
}

export function getCropQuestions(crop: Crop, language: Language): string[] {
  if (language === 'ta') return crop.quickQuestions.ta || crop.quickQuestions.en;
  if (language === 'te') return crop.quickQuestions.te || crop.quickQuestions.en;
  if (language === 'hi') return crop.quickQuestions.hi || crop.quickQuestions.en;
  return crop.quickQuestions.en;
}
