import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '25mb' }));

// Shared Gemini client with required User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to check API Key
function checkApiKey(res: Response): boolean {
  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({
      error: 'GEMINI_API_KEY is not configured on the server. Please check your AI Studio environment settings.',
    });
    return false;
  }
  return true;
}

/**
 * Endpoint 1: Farming Query with Google Search Grounding
 * Uses model: gemini-3.5-flash with googleSearch tool
 */
app.post('/api/farming-query', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const { crop, question, language, cropStage, soilType } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    let systemInstruction = `You are "BhuMitra AI" - a warm, empathetic, and expert agricultural scientist advising farmers across India.
Provide clear, practical, and scientifically sound advice in simple, easy-to-understand language.
Guidelines:
1. Tone: Encouraging, respectful, and crystal clear. Avoid academic jargon without immediate simple explanations.
2. Structure:
   - 🌾 Quick Direct Solution (Immediate summary)
   - 📋 Step-by-Step Action Plan
   - 🌿 Organic & Eco-Friendly Treatments (Neem oil, Bio-fertilizers, Panchagavya, Trichoderma, etc.)
   - 🧪 Chemical / Conventional options with precise, safe dosage if urgently needed
   - ⚠️ Crucial Dos & Don'ts (Water management, spray timing, precautions)
3. Fresh Grounding: Use Google Search to provide up-to-date pest management, weather-resilient practices, and university recommendations.`;

    if (language === 'ta') {
      systemInstruction = `நீங்கள் "பூமித்ரா AI" (BhuMitra AI) - இந்திய விவசாயிகளுக்கான அனுபவம் வாய்ந்த, பாசமுள்ள விவசாய விஞ்ஞானி மற்றும் ஆலோசகர்.
விவசாயிகள் கேட்கும் கேள்விகளுக்கு மிக எளிய, நடைமுறைக்கேற்ற மற்றும் அறிவியல் ரீதியான ஆலோசனைகளைத் தமிழில் வழங்குங்கள்.
வழிகாட்டுதல்கள்:
1. மொழி: விவசாயிகள் எளிதாகப் புரிந்து கொள்ளக்கூடிய தமிழ் (கடினமான ஆங்கிலச் சொற்களைத் தவிர்க்கவும், அவசியமான இடங்களில் அடைப்புக்குறிக்குள் குறிப்பிடவும்).
2. கட்டமைப்பு:
   - 🌾 உடனடி தீர்வு (சுருக்கமாக)
   - 📋 படிப்படியான வழிகாட்டுதல்
   - 🌿 இயற்கை மற்றும் உயிரியல் முறைகள் (பஞ்சகவ்யா, வேப்பெண்ணெய், ஜீவாமிர்தம் போன்றவை)
   - 🧪 தேவைப்படின் பரிந்துரைக்கப்படும் பூச்சிக்கொல்லி/உரம் மற்றும் சரியான அளவு
   - ⚠️ செய்யவேண்டியவை மற்றும் செய்யக்கூடாதவை
3. உண்மைத் தன்மை: தற்போதைய பருவநிலை, சந்தை நிலவரம், அல்லது அங்கீகரிக்கப்பட்ட வேளாண் பல்கலைக்கழக பரிந்துரைகளுக்கு கூகுள் தேடலைப் பயன்படுத்தவும்.`;
    } else if (language === 'te') {
      systemInstruction = `మీరు "భూమిత్ర AI" (BhuMitra AI) - భారతీయ రైతులకు అంకితభావం కలిగిన, అనుభవజ్ఞుడైన వ్యవసాయ శాస్త్రవేత్త మరియు స్నేహపూర్వక సలహాదారు.
రైతులు అడిగే ప్రశ్నలకు అత్యంత సరళమైన, ఆచరణాత్మకమైన మరియు శాస్త్రీయమైన సమాధానాలను స్పష్టమైన తెలుగులో అందించండి.
మార్గదర్శకాలు:
1. భాష: రైతులకు సులభంగా అర్థమయ్యే సహజమైన తెలుగు (క్లిష్టమైన ఇంగ్లీష్ పదాలు నివారించండి, అవసరమైతే బ్రాకెట్లలో ఉంచండి).
2. సమాధాన నిర్మాణం:
   - 🌾 తక్షణ పరిష్కారం (సారాంశం)
   - 📋 దశలవారీగా చేపట్టాల్సిన పనులు
   - 🌿 సేంద్రీయ మరియు జీవనియంత్రణ పద్ధతులు (జీవామృతం, వేపనూనె, పంచగవ్య, ట్రైకోడెర్మా మొదలైనవి)
   - 🧪 తీవ్రత ఎక్కువగా ఉన్నప్పుడు మాత్రమే సిఫార్సు చేసిన రసాయన మందులు & ఖచ్చితమైన మోతాదు
   - ⚠️ ముఖ్యమైన జాగ్రత్తలు (చేయవలసినవి మరియు చేయకూడనివి)
3. నిజ సమయ గ్రౌండింగ్: తాజా పరిశోధనలు, వ్యవసాయ విశ్వవిద్యాలయాల సిఫార్సులు మరియు వాతావరణం కోసం గూగుల్ సెర్చ్ ఉపయోగించండి.`;
    } else if (language === 'hi') {
      systemInstruction = `आप "भूमिमित्र AI" (BhuMitra AI) - भारतीय किसानों के सच्चे मार्गदर्शक, अनुभवी कृषि वैज्ञानिक और आत्मीय सलाहकार हैं।
किसानों द्वारा पूछे गए प्रश्नों के बहुत ही सरल, व्यावहारिक और वैज्ञानिक उत्तर स्पष्ट हिंदी में प्रदान करें।
दिशानिर्देश:
1. भाषा: किसानों के लिए सरल, सुबोध और व्यावहारिक हिंदी (कठिन अंग्रेजी शब्दों से बचें, जरूरी हो तो कोष्ठक में लिखें)।
2. उत्तर की रूपरेखा:
   - 🌾 त्वरित समाधान (संक्षिप्त निष्कर्ष)
   - 📋 चरणबद्ध कार्ययोजना (Step-by-Step)
   - 🌿 जैविक एवं प्राकृतिक उपचार (नीम का तेल, जीवामृत, पंचगव्य, ट्राइकोडर्मा, बीजामृत आदि)
   - 🧪 गंभीर प्रकोप की स्थिति में अनुशंसित कीटनाशक/खाद एवं सटीक मात्रा प्रति एकड़
   - ⚠️ सावधानियां (क्या करें और क्या न करें)
3. गूगल सर्च ग्राउंडिंग: कृषि विश्वविद्यालयों की नवीनतम सिफारिशों, मौसम एवं कीट प्रबंधन के लिए लाइव गूगल सर्च का उपयोग करें।`;
    }

    const cropContext = crop ? `Selected Crop: ${crop}` : 'Crop: General Agriculture';
    const stageContext = cropStage ? `, Stage: ${cropStage}` : '';
    const soilContext = soilType ? `, Soil: ${soilType}` : '';

    const userPrompt = `${cropContext}${stageContext}${soilContext}
Farmer's Question: "${question}"

Please provide comprehensive, easy-to-read farming advice formatted with clear headings, bullet points, and practical dosages.`;

    let response;
    let answerText = '';
    const sources: Array<{ title: string; uri: string }> = [];

    try {
      // Primary: gemini-3.5-flash with googleSearch tool
      response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        },
      });
      answerText = response.text || '';

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (Array.isArray(chunks)) {
        for (const chunk of chunks) {
          if (chunk.web?.uri) {
            sources.push({
              title: chunk.web.title || chunk.web.uri,
              uri: chunk.web.uri,
            });
          }
        }
      }
    } catch (primaryErr: any) {
      console.warn('Primary model gemini-3.5-flash failed or hit quota, trying fallback:', primaryErr?.message);
      // Fallback: gemini-3.8-flash
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          tools: [{ googleSearch: {} }],
        },
      });
      answerText = response.text || '';

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (Array.isArray(chunks)) {
        for (const chunk of chunks) {
          if (chunk.web?.uri) {
            sources.push({
              title: chunk.web.title || chunk.web.uri,
              uri: chunk.web.uri,
            });
          }
        }
      }
    }

    return res.json({
      answer: answerText,
      sources,
      crop: crop || 'General',
      language: language || 'en',
    });
  } catch (error: any) {
    console.error('Error in /api/farming-query:', error);
    let errMsg = error?.message || 'Failed to process farming query.';
    if (errMsg.includes('429') || errMsg.includes('quota')) {
      errMsg = 'Gemini API free tier rate limit or quota exceeded. Please configure a paid API key in AI Studio Secrets to continue without limits.';
    }
    return res.status(500).json({
      error: errMsg,
    });
  }
});

/**
 * Endpoint 2: Analyze Crop Image (Pest & Disease Diagnosis)
 * Uses model: gemini-3.1-pro-preview with multimodal image input
 */
app.post('/api/analyze-crop-image', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const { imageBase64, mimeType = 'image/jpeg', crop, notes, language } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Crop image is required' });
    }

    // Clean base64 string if data URI prefix is included
    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

    let systemInstruction = `You are "BhuMitra AI" - a senior Plant Pathologist and Agronomist.
Carefully examine the crop photo submitted by the farmer. Identify any pest damage, fungal/bacterial/viral disease, nutrient deficiency, water stress, or general health status.
Provide an encouraging, clear diagnosis that a farmer can act upon today.`;

    if (language === 'ta') {
      systemInstruction = `நீங்கள் "பூமித்ரா AI" - தாவர நோயியல் மற்றும் பூச்சியியல் வல்லுநர் (Plant Pathologist).
விவசாயி பதிவேற்றிய பயிர் புகைப்படத்தை கூர்ந்து ஆராய்ந்து, அதில் உள்ள பூச்சி, நோய், ஊட்டச்சத்துக் குறைபாடு அல்லது பயிர் ஆரோக்கியத்தை துல்லியமாக கண்டறியுங்கள்.
விவசாயி எளிதாக புரிந்து கொள்ளும் வகையில் தமிழில் பதில் கூறுங்கள்.`;
    } else if (language === 'te') {
      systemInstruction = `మీరు "భూమిత్ర AI" - మొక్కల రోగనిర్ధారణ మరియు సస్యరక్షణ శాస్త్రవేత్త (Plant Pathologist & Agronomist).
రైతు సమర్పించిన పంట ఆకు లేదా మొక్క ఫోటోను నిశితంగా పరిశీలించి, తెగుళ్లు, కీటకాలు, పోషక లోపాలు లేదా మొక్క ఆరోగ్యాన్ని ఖచ్చితంగా గుర్తించండి.
రైతు సులభంగా అర్థం చేసుకునే రీతిలో స్పష్టమైన తెలుగులో సలహాలు అందించండి.`;
    } else if (language === 'hi') {
      systemInstruction = `आप "भूमिमित्र AI" - वरिष्ठ पादप रोग विशेषज्ञ एवं सस्य वैज्ञानिक (Plant Pathologist & Agronomist) हैं।
किसान द्वारा भेजी गई फसल या पत्ती की तस्वीर का सूक्ष्मता से विश्लेषण करें तथा रोग, कीट, पोषक तत्वों की कमी अथवा पौधे की स्थिति की सटीक पहचान करें।
किसानों के लिए अत्यंत सरल, स्पष्ट और व्यावहारिक हिंदी में निदान व उपचार सुझाएं।`;
    }

    let promptText = `Crop type: ${crop || 'General Crop'}
Farmer's extra notes: ${notes || 'None provided'}

Please analyze this crop image in detail and provide:
1. Diagnosis / Condition Name (Common name & Scientific name if applicable)
2. Severity Level (Low / Moderate / Urgent Attention Needed)
3. Visible Symptoms (What indicates this problem in the leaf, stem, or fruit)
4. Immediate Organic & Natural Remedies (e.g. Neem spray, Bio-fungicides, cultural practices)
5. Chemical / Conventional Treatment with safe dosage (if infection is severe)
6. Prevention for healthy nearby crops`;

    if (language === 'ta') {
      promptText = `பயிர் வகை: ${crop || 'பொதுவான பயிர்'}
விவசாயியின் கூடுதல் குறிப்பு: ${notes || 'எதுவுமில்லை'}

தயவுசெய்து இந்த புகைப்படத்தை ஆராய்ந்து கீழ்கண்ட விவரங்களைத் தெளிவாக வழங்கவும்:
1. கண்டறியப்பட்ட பிரச்சனை / நோய் / பூச்சியின் பெயர் (தமிழ் மற்றும் ஆங்கிலத்தில்)
2. தீவிரம் (குறைவு / நடுத்தரம் / அவசரம்)
3. உடனடி முதலுதவி / இயற்கை சிகிச்சை முறை (உதாரணம்: வேப்பெண்ணெய் கரைசல், சூடோமோனாஸ்)
4. தீவிர பாதிப்புக்கு பரிந்துரைக்கப்படும் சிகிச்சை & மருந்தளவு
5. அடுத்த பருவத்திற்கான தடுப்பு முறைகள்`;
    } else if (language === 'te') {
      promptText = `పంట రకం: ${crop || 'సాధారణ పంట'}
రైతు అదనపు సమాచారం: ${notes || 'ఏమీ పేర్కొనలేదు'}

దయచేసి ఈ పంట ఫోటోను క్షుణ్ణంగా పరిశీలించి క్రింది వివరాలను స్పష్టంగా అందించండి:
1. గుర్తించిన సమస్య / తెగులు / పురుగు పేరు (తెలుగు మరియు ఆంగ్లంలో)
2. తీవ్రత స్థాయి (తక్కువ / మధ్యస్థం / అత్యవసర నివారణ అవసరం)
3. కనిపించే ప్రధాన లక్షణాలు (ఆకులు, కాండం లేదా కాయలపై)
4. తక్షణ సేంద్రీయ / సహజ నివారణ మార్గాలు (ఉదా: వేపనూనె ద్రావణం, ట్రైకోడెర్మా, జీవామృతం)
5. తీవ్రమైన సందర్భాల్లో వాడాల్సిన రసాయన మందు & ఎకరానికి సరైన మోతాదు
6. ఇతర పంటలకు వ్యాపించకుండా తీసుకోవాల్సిన జాగ్రత్తలు`;
    } else if (language === 'hi') {
      promptText = `फसल का प्रकार: ${crop || 'सामान्य फसल'}
किसान का विवरण / लक्षण: ${notes || 'कोई अतिरिक्त विवरण नहीं'}

कृपया इस फसल तस्वीर का विस्तार से विश्लेषण करें और निम्नलिखित बिंदु स्पष्ट रूप से बताएं:
1. पहचाना गया रोग / कीट / समस्या का नाम (हिंदी और अंग्रेजी में)
2. गंभीरता का स्तर (कम / मध्यम / तत्काल उपचार आवश्यक)
3. दिखाई देने वाले मुख्य लक्षण (पत्तियों, तने या फल पर)
4. तत्काल जैविक एवं प्राकृतिक प्राथमिक उपचार (उदा: नीम तेल स्प्रे, ट्राइकोडर्मा, छाछ-हींग का घोल)
5. गंभीर संक्रमण होने पर अनुशंसित रासायनिक उपचार एवं प्रति एकड़ सुरक्षित दवा की मात्रा
6. खेत की अन्य स्वस्थ फसलों को बचाने हेतु आवश्यक रोकथाम उपाय`;
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: cleanBase64,
      },
    };

    const textPart = {
      text: promptText,
    };

    let response;
    let reportText = '';

    try {
      // Primary: gemini-3.1-pro-preview
      response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction,
        },
      });
      reportText = response.text || '';
    } catch (primaryErr: any) {
      console.warn('Primary model gemini-3.1-pro-preview failed, trying fallback model gemini-3.8-flash:', primaryErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
          systemInstruction,
        },
      });
      reportText = response.text || '';
    }

    return res.json({
      report: reportText,
      crop: crop || 'General',
      language: language || 'en',
    });
  } catch (error: any) {
    console.error('Error in /api/analyze-crop-image:', error);
    let errMsg = error?.message || 'Failed to analyze crop image.';
    if (errMsg.includes('429') || errMsg.includes('quota')) {
      errMsg = 'Gemini API quota exceeded. Please select a paid API key in AI Studio Secrets.';
    }
    return res.status(500).json({
      error: errMsg,
    });
  }
});

/**
 * Endpoint 3: Multilingual Text-to-Speech (TTS)
 * Uses model: gemini-3.8-flash-tts
 * Returns a complete unary WAV audio file (audio/wav) base64 encoded
 */
app.post('/api/text-to-speech', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const { text, language } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    // Limit text length to provide rapid verbal summary for farmers
    let textToSpeak = text.trim();
    if (textToSpeak.length > 500) {
      // Extract first 500 characters or key sentences
      textToSpeak = textToSpeak.slice(0, 500) + '...';
    }

    let voiceStyle = 'Calm, friendly, articulate agricultural advisor speaking clearly to a farmer';
    if (language === 'ta') {
      voiceStyle = 'Warm, respectful, clear Tamil agricultural guide speaking gently to a farmer';
    } else if (language === 'te') {
      voiceStyle = 'Warm, respectful, clear Telugu agricultural guide speaking gently to a farmer';
    } else if (language === 'hi') {
      voiceStyle = 'Warm, respectful, clear Hindi agricultural guide speaking gently to a farmer';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: textToSpeak,
              speechMetadata: {
                style: voiceStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // Prebuilt voices: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    // Unary default returns complete WAV file in inlineData
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      return res.status(500).json({ error: 'Audio generation failed from model' });
    }

    return res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('Error in /api/text-to-speech:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate audio.',
    });
  }
});

/**
 * Endpoint 4: Generate Farming Visual Photo & Field Demonstration
 * Generates clear illustrative photos and visual symptom guides
 */
app.post('/api/generate-farming-image', async (req: Request, res: Response) => {
  if (!checkApiKey(res)) return;

  try {
    const { prompt, crop, language = 'en', context } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required for photo generation' });
    }

    const cropName = crop || 'General Agriculture';
    const lang = (language as 'en' | 'ta' | 'te' | 'hi') || 'en';

    // 1. Synthesize structured visual pathology & field insights using gemini-3.8-flash
    const langInstruction =
      lang === 'ta'
        ? 'Write visualTitle, whatToLookFor (array of 3 points), healthyVsDamaged, and practicalAdvice entirely in natural Tamil'
        : lang === 'te'
        ? 'Write visualTitle, whatToLookFor (array of 3 points), healthyVsDamaged, and practicalAdvice entirely in natural Telugu'
        : lang === 'hi'
        ? 'Write visualTitle, whatToLookFor (array of 3 points), healthyVsDamaged, and practicalAdvice entirely in natural Hindi'
        : 'Write visualTitle, whatToLookFor (array of 3 points), healthyVsDamaged, and practicalAdvice in clear English';

    const metaPrompt = `You are BhuMitra AI - Plant Pathology and Visual Agronomy Specialist.
A farmer needs an educational visual photo to understand:
Crop: ${cropName}
Query / Condition: "${prompt.trim()}"
${context ? `Background Advice: "${context.slice(0, 350)}"` : ''}

${langInstruction}.
Generate a STRICT JSON response with this exact schema:
{
  "visualTitle": "Short descriptive title of what the photo shows",
  "photographicPrompt": "English photographic prompt for image generator: ultra-sharp, real-world educational close-up macro field photograph of ${cropName}, clearly demonstrating ${prompt}, daylight, macro detail, high resolution, real farming guide style",
  "whatToLookFor": [
    "Key visual indicator 1 (e.g. lesion shape, spot borders, color)",
    "Key visual indicator 2 (e.g. vein patterns, undersides of leaves, pest appearance)",
    "Key visual indicator 3 (e.g. wilting signs, water droplet distribution, soil state)"
  ],
  "healthyVsDamaged": "Brief 1-2 sentence comparison between healthy plant tissue and affected area",
  "practicalAdvice": "Brief 1-2 sentence field tip for the farmer based on this photo"
}`;

    const metaResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: metaPrompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let visualGuide: any = {};
    try {
      visualGuide = JSON.parse(metaResponse.text || '{}');
    } catch {
      visualGuide = {
        visualTitle: prompt,
        photographicPrompt: `Close-up clear agricultural photo of ${cropName} ${prompt}, daylight farm demonstration`,
        whatToLookFor: [
          'Inspect leaf margins and centers for discoloration or spots',
          'Check undersides of leaves for fungal powdery growth or pests',
          'Observe stem nodes and soil moisture level',
        ],
        healthyVsDamaged: 'Healthy plant parts show vibrant green color without lesions or wilting.',
        practicalAdvice: 'Inspect your field early in the morning and take timely corrective measures.',
      };
    }

    let imageBase64: string | null = null;

    // 2. Attempt real-time image generation via gemini-3.1-flash-lite-image
    try {
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [
            {
              text:
                visualGuide.photographicPrompt ||
                `Clear educational agricultural photo of ${cropName} showing ${prompt}, daylight farm demonstration, high clarity`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: '4:3',
          },
        },
      });

      const candidates = imageResponse.candidates;
      if (candidates && candidates[0]?.content?.parts) {
        for (const part of candidates[0].content.parts) {
          if (part.inlineData?.data) {
            imageBase64 = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (imgError: any) {
      console.warn('Real-time image generation note:', imgError?.message);
    }

    // 3. Fallback selection to ensure the farmer ALWAYS gets an ultra-clear, high-definition photo
    let fallbackImageUrl = '/src/assets/images/paddy_blast_disease_1790846896872.jpg';
    const lowerPrompt = (prompt + ' ' + (context || '')).toLowerCase();
    if (lowerPrompt.includes('water') || lowerPrompt.includes('drip') || lowerPrompt.includes('irrigat')) {
      fallbackImageUrl = '/src/assets/images/drip_irrigation_guide_1790846908914.jpg';
    } else if (
      lowerPrompt.includes('pest') ||
      lowerPrompt.includes('spray') ||
      lowerPrompt.includes('neem') ||
      lowerPrompt.includes('insect') ||
      lowerPrompt.includes('caterpillar') ||
      lowerPrompt.includes('borer')
    ) {
      fallbackImageUrl = '/src/assets/images/organic_pest_spray_1790846927636.jpg';
    } else if (
      lowerPrompt.includes('nutrient') ||
      lowerPrompt.includes('fertiliz') ||
      lowerPrompt.includes('yellow') ||
      lowerPrompt.includes('nitrogen') ||
      lowerPrompt.includes('potassium')
    ) {
      fallbackImageUrl = '/src/assets/images/nutrient_deficiency_leaf_1790846943713.jpg';
    }

    return res.json({
      imageUrl: imageBase64 || fallbackImageUrl,
      isLiveGenerated: !!imageBase64,
      visualTitle: visualGuide.visualTitle || prompt,
      whatToLookFor: visualGuide.whatToLookFor || [],
      healthyVsDamaged: visualGuide.healthyVsDamaged || '',
      practicalAdvice: visualGuide.practicalAdvice || '',
      crop: cropName,
    });
  } catch (error: any) {
    console.error('Error in /api/generate-farming-image:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to generate visual demonstration.',
    });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'BhuMitra AI',
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 BhuMitra AI running on port ${PORT}`);
  });
}

startServer();
