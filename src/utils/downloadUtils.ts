/**
 * Utility functions for downloading farmer advisories, diagnostic prescriptions,
 * weather bulletins, and voice notes.
 *
 * Implements iframe-safe file downloads using Blob URLs, avoiding window.alert / window.open.
 */

import { Language } from '../data/translations';

export interface AdvisoryReportData {
  cropName: string;
  question: string;
  answer: string;
  sources?: Array<{ title: string; uri: string }>;
  language: Language;
  timestamp?: string;
}

export interface DiagnosisReportData {
  cropName: string;
  notes?: string;
  report: string;
  imageBase64?: string | null;
  language: Language;
  timestamp?: string;
}

export interface WeatherBulletinData {
  locationName: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  sprayAdvisory: string;
  irrigationAdvisory: string;
  forecastDays: Array<{
    day: string;
    condition: string;
    maxTemp: number;
    minTemp: number;
    rainChance: number;
  }>;
  language: Language;
  cropName?: string;
  timestamp?: string;
}

/**
 * Triggers a download of arbitrary content as a file using an anchor tag and Blob URL.
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 200);
}

/**
 * Download simple plain text file (.txt)
 */
export function downloadTextFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  triggerBlobDownload(blob, filename.endsWith('.txt') ? filename : `${filename}.txt`);
}

/**
 * Download audio from base64 string (.wav)
 */
export function downloadAudioBase64(filename: string, base64Audio: string, mimeType = 'audio/wav'): void {
  try {
    const cleanBase64 = base64Audio.replace(/^data:audio\/[a-zA-Z0-9+.-]+;base64,/, '');
    const byteCharacters = atob(cleanBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    triggerBlobDownload(blob, filename.endsWith('.wav') ? filename : `${filename}.wav`);
  } catch (err) {
    console.error('Failed to convert base64 audio to blob download:', err);
  }
}

/**
 * Prints HTML content without window.open, using a temporary hidden iframe.
 * Avoids popup blockers and iframe security restrictions.
 */
export function printHtmlViaIframe(htmlContent: string): void {
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  // Allow styles and fonts to render before printing
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.warn('Iframe print failed:', e);
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }
  }, 400);
}

/**
 * Generate formatted standalone HTML advisory report
 */
export function generateAdvisoryReportHtml(data: AdvisoryReportData): string {
  const isTa = data.language === 'ta';
  const isTe = data.language === 'te';
  const isHi = data.language === 'hi';
  const locale = isTa ? 'ta-IN' : isTe ? 'te-IN' : isHi ? 'hi-IN' : 'en-IN';
  const now = data.timestamp || new Date().toLocaleString(locale, {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  let appTitle = 'BhuMitra AI - Farmer Advisory Report';
  let cropLabel = 'Crop';
  let dateLabel = 'Date & Time';
  let questionLabel = "Farmer's Query";
  let answerLabel = 'Scientific Advisory & Recommendations';
  let sourcesLabel = 'Verified Agricultural Sources';
  let disclaimerText = 'BhuMitra AI provides advisory recommendations based on agricultural science and web sources. For severe pest outbreaks, consult your local Krishi Vigyan Kendra (KVK) or Agriculture Extension Officer.';
  let offlineBadge = 'Offline Digital Copy';
  let tagline = 'Smart Agriculture Advisory & Pest Management';

  if (isTa) {
    appTitle = 'பூமித்ரா AI - வேளாண் ஆலோசனை அறிக்கை';
    cropLabel = 'பயிர்';
    dateLabel = 'தேதி & நேரம்';
    questionLabel = 'விவசாயியின் கேள்வி';
    answerLabel = 'அறிவியல் ஆலோசனை & தீர்வு';
    sourcesLabel = 'சரிபார்க்கப்பட்ட வேளாண் ஆதாரங்கள்';
    disclaimerText = 'பூமித்ரா AI வேளாண் அறிவியல் மற்றும் அங்கீகரிக்கப்பட்ட பல்கலைக் கழக வழிகாட்டல்களின் அடிப்படையில் தயாரிக்கப்பட்டது. தீவிர பூச்சி தாக்குதலுக்கு அருகில் உள்ள வேளாண்மை அறிவியல் மையத்தை (KVK) அணுகவும்.';
    offlineBadge = 'ஆஃப்லைன் ஆவணம்';
    tagline = 'விவசாயிகளுக்கான நவீன வேளாண் ஆலோசனை சேவை';
  } else if (isTe) {
    appTitle = 'భూమిత్ర AI - రైతు వ్యవసాయ సలహా పత్రం';
    cropLabel = 'పంట';
    dateLabel = 'తేదీ & సమయం';
    questionLabel = 'రైతు అడిగిన ప్రశ్న';
    answerLabel = 'శాస్త్రీయ వ్యవసాయ సలహా & పరిష్కారాలు';
    sourcesLabel = 'ధృవీకరించబడిన వ్యవసాయ ఆధారాలు & లింకులు';
    disclaimerText = 'భూమిత్ర AI వ్యవసాయ శాస్త్రం మరియు విశ్వసనీయ సమాచారం ఆధారంగా సలహాలు అందిస్తుంది. తీవ్రమైన నష్టాల నివారణకు మీ స్థానిక కృషి విజ్ఞాన కేంద్రం (KVK) లేదా వ్యవసాయ అధికారిని సంప్రదించండి.';
    offlineBadge = 'ఆఫ్‌లైన్ రికార్డు';
    tagline = 'రైతులకు స్మార్ట్ వ్యవసాయ సలహా మరియు సస్యరక్షణ మార్గదర్శి';
  } else if (isHi) {
    appTitle = 'भूमिमित्र AI - किसान परामर्श रिपोर्ट';
    cropLabel = 'फसल';
    dateLabel = 'दिनांक व समय';
    questionLabel = 'किसान का प्रश्न';
    answerLabel = 'वैज्ञानिक परामर्श एवं समाधान';
    sourcesLabel = 'सत्यापित कृषि स्रोत एवं लिंक्स';
    disclaimerText = 'भूमिमित्र AI कृषि विज्ञान और प्रमाणित स्रोतों के आधार पर सलाह देता है। गंभीर कीट प्रकोप के लिए अपने निकटतम कृषि विज्ञान केंद्र (KVK) या कृषि अधिकारी से संपर्क करें।';
    offlineBadge = 'ऑफलाइन प्रति';
    tagline = 'भारतीय किसानों का विश्वसनीय कृषि परामर्श एवं सस्य सुरक्षा साथी';
  }

  // Process markdown formatting into clean HTML
  const formattedAnswer = data.answer
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '<br/>';
      if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
        const hText = trimmed.replace(/^#+\s*/, '');
        return `<h3 style="color:#065f46; font-size:16px; margin-top:18px; margin-bottom:8px; border-bottom:1px solid #d1fae5; padding-bottom:4px; font-weight:700;">${escapeHtml(hText)}</h3>`;
      }
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const bText = trimmed.replace(/^[*•-]\s*/, '');
        return `<li style="margin-bottom:6px; color:#1f2937;">${formatBoldHtml(bText)}</li>`;
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return `<div style="margin-bottom:6px; color:#1f2937;"><strong>${escapeHtml(trimmed.slice(0, 3))}</strong> ${formatBoldHtml(trimmed.slice(3))}</div>`;
      }
      return `<p style="margin-bottom:8px; line-height:1.6; color:#1f2937;">${formatBoldHtml(trimmed)}</p>`;
    })
    .join('');

  const sourcesHtml =
    data.sources && data.sources.length > 0
      ? `
      <div style="margin-top:24px; padding:14px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px;">
        <h4 style="margin:0 0 8px 0; color:#166534; font-size:13px; font-weight:700;">${sourcesLabel}</h4>
        <ul style="margin:0; padding-left:20px; font-size:12px; color:#15803d;">
          ${data.sources
            .map(
              (s) =>
                `<li style="margin-bottom:4px;"><a href="${escapeHtml(s.uri)}" target="_blank" style="color:#047857; text-decoration:underline;">${escapeHtml(s.title || s.uri)}</a></li>`
            )
            .join('')}
        </ul>
      </div>`
      : '';

  return `<!DOCTYPE html>
<html lang="${data.language}">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(appTitle)}</title>
  <style>
    @page { margin: 15mm; size: A4 portrait; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #ffffff;
      color: #111827;
      margin: 0;
      padding: 24px;
      line-height: 1.5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #10b981;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .badge {
      display: inline-block;
      background: #ecfdf5;
      color: #047857;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      border: 1px solid #a7f3d0;
      text-transform: uppercase;
    }
    .meta-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 14px 18px;
      margin-bottom: 20px;
      font-size: 13px;
    }
    .question-box {
      background: #fefce8;
      border-left: 4px solid #eab308;
      padding: 12px 16px;
      border-radius: 0 12px 12px 0;
      margin-bottom: 22px;
    }
    .answer-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 20px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 14px;
      border-top: 1px dashed #cbd5e1;
      font-size: 11px;
      color: #64748b;
      text-align: center;
    }
    @media print {
      body { padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:24px;">🌾</span>
          <h1 style="margin:0; font-size:22px; font-weight:800; color:#064e3b;">BhuMitra AI</h1>
        </div>
        <p style="margin:2px 0 0 0; font-size:12px; color:#047857; font-weight:600;">
          ${tagline}
        </p>
      </div>
      <div style="text-align:right;">
        <span class="badge">${offlineBadge}</span>
        <div style="font-size:11px; color:#6b7280; margin-top:4px;">Official Advisory Slip</div>
      </div>
    </div>

    <div class="meta-box">
      <div>
        <span style="color:#6b7280; font-size:11px; display:block;">${cropLabel}:</span>
        <strong style="color:#064e3b; font-size:15px;">${escapeHtml(data.cropName)}</strong>
      </div>
      <div>
        <span style="color:#6b7280; font-size:11px; display:block;">${dateLabel}:</span>
        <span style="color:#374151; font-weight:600;">${escapeHtml(now)}</span>
      </div>
    </div>

    <div class="question-box">
      <div style="font-size:11px; font-weight:700; color:#854d0e; text-transform:uppercase; margin-bottom:4px;">${questionLabel}:</div>
      <div style="font-size:14px; font-weight:600; color:#713f12; font-style:italic;">"${escapeHtml(data.question)}"</div>
    </div>

    <div class="answer-card">
      <div style="font-size:14px; font-weight:800; color:#065f46; margin-bottom:12px; border-bottom:1px solid #f1f5f9; padding-bottom:8px;">
        ${answerLabel}
      </div>
      <div>
        ${formattedAnswer}
      </div>
      ${sourcesHtml}
    </div>

    <div class="footer">
      <p style="margin:0 0 6px 0;"><strong>⚠️ Disclaimer:</strong> ${disclaimerText}</p>
      <p style="margin:0; font-size:10px; color:#94a3b8;">Generated by BhuMitra AI • Kisan Assistance Initiative • Keep this document for field reference</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate standalone HTML for Crop Doctor Disease Diagnosis Prescription
 */
export function generateDiagnosisReportHtml(data: DiagnosisReportData): string {
  const isTa = data.language === 'ta';
  const isTe = data.language === 'te';
  const isHi = data.language === 'hi';
  const locale = isTa ? 'ta-IN' : isTe ? 'te-IN' : isHi ? 'hi-IN' : 'en-IN';
  const now = data.timestamp || new Date().toLocaleString(locale, {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  let title = 'Crop Doctor - Plant Pathology & Diagnosis Prescription';
  let cropLabel = 'Examined Crop';
  let notesLabel = "Farmer's Observed Symptoms";
  let findingsLabel = 'Pathology Findings & Treatment Regimen';
  let imageLabel = 'Analyzed Crop Photo Sample';
  let subTagline = 'BhuMitra AI • Multimodal Plant Pathology Diagnostic Slip';
  let badgeText = 'Rx Agronomy Slip';
  let safetyNotice = 'Safety Reminder: Always follow labeled dosage instructions. Wear personal protective equipment (mask, gloves) when preparing sprays.';
  let footerIssued = 'Issued by BhuMitra Crop Doctor • Agricultural AI Assistant';

  if (isTa) {
    title = 'பயிர் மருத்துவர் - நோய் கண்டறிதல் & மருந்து சீட்டு';
    cropLabel = 'பரிசோதிக்கப்பட்ட பயிர்';
    notesLabel = 'விவசாயி குறிப்பிட்ட அறிகுறிகள்';
    findingsLabel = 'நோயியல் பரிசோதனை முடிவு & தீர்வுகள்';
    imageLabel = 'ஆய்வு செய்யப்பட்ட இலை / பயிர் புகைப்படம்';
    subTagline = 'பூமித்ரா AI • நவீன தாவர நோயியல் பரிசோதனை அறிக்கை';
    badgeText = 'மருந்து சீட்டு (Rx)';
    safetyNotice = 'பாதுகாப்பு எச்சரிக்கை: பூச்சிக்கொல்லி மருந்துகளை பரிந்துரைக்கப்பட்ட அளவில் மட்டுமே பயன்படுத்தவும். தெளிக்கும் போது முகக்கவசம் அணியவும்.';
    footerIssued = 'பூமித்ரா பயிர் மருத்துவர் • வேளாண் செயற்கை நுண்ணறிவு சேவை';
  } else if (isTe) {
    title = 'క్రాప్ డాక్టర్ - పంట రోగనిర్ధారణ & ప్రిస్క్రిప్షన్ స్లిప్';
    cropLabel = 'పరీక్షించిన పంట';
    notesLabel = 'రైతు పేర్కొన్న లక్షణాలు';
    findingsLabel = 'రోగనిర్ధారణ ఫలితాలు & సిఫార్సు చేసిన చికిత్స';
    imageLabel = 'పరీక్షించిన ఆకు / మొక్క ఫోటో నమూనా';
    subTagline = 'భూమిత్ర AI • మల్టీమోడల్ ప్లాంట్ పాథాలజీ డయాగ్నస్టిక్ స్లిప్';
    badgeText = 'ప్రిస్క్రిప్షన్ (Rx)';
    safetyNotice = 'రక్షణ హెచ్చరిక: మందుల మోతాదును లేబుల్ ప్రకారం ఖచ్చితంగా పాటించండి. పిచికారీ సమయంలో చేతి తొడుగులు మరియు మాస్క్ ధరించండి.';
    footerIssued = 'భూమిత్ర క్రాప్ డాక్టర్ • వ్యవసాయ సహాయక వ్యవస్థ';
  } else if (isHi) {
    title = 'क्रॉप डॉक्टर - पादप रोग निदान एवं उपचार नुस्खा';
    cropLabel = 'परीक्षित फसल';
    notesLabel = 'किसान द्वारा बताए गए लक्षण';
    findingsLabel = 'रोग परीक्षण निष्कर्ष एवं उपचार कार्ययोजना';
    imageLabel = 'परीक्षित पत्ती / पौधे का फोटो नमूना';
    subTagline = 'भूमिमित्र AI • मल्टीमॉडल पादप रोग विज्ञान निदान रिपोर्ट';
    badgeText = 'प्रिस्क्रिप्शन स्लिप (Rx)';
    safetyNotice = 'सुरक्षा चेतावनी: रसायनों का छिड़काव अनुशंसित मात्रा में ही करें। छिड़काव के समय दस्ताने और मास्क का अनिवार्य उपयोग करें।';
    footerIssued = 'भूमिमित्र क्रॉप डॉक्टर • डिजिटल किसान सहायता पहल';
  }

  const formattedReport = data.report
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '<br/>';
      if (/^#+\s*/.test(trimmed)) {
        const text = trimmed.replace(/^#+\s*/, '');
        return `<h3 style="color:#065f46; font-size:15px; margin-top:14px; margin-bottom:6px; font-weight:700;">${escapeHtml(text)}</h3>`;
      }
      if (/^(\d+\.|\*|-|•)\s*/.test(trimmed)) {
        return `<div style="margin-bottom:6px; color:#1f2937;">${formatBoldHtml(trimmed)}</div>`;
      }
      return `<p style="margin-bottom:6px; line-height:1.5; color:#1f2937;">${formatBoldHtml(trimmed)}</p>`;
    })
    .join('');

  const imageSection = data.imageBase64
    ? `
    <div style="margin-bottom:20px; text-align:center; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px;">
      <div style="font-size:11px; font-weight:700; color:#475569; margin-bottom:8px; text-align:left;">${imageLabel}:</div>
      <img src="${data.imageBase64}" alt="Crop Sample" style="max-height:220px; max-width:100%; border-radius:8px; object-fit:contain; border:1px solid #cbd5e1;" />
    </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="${data.language}">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <style>
    @page { margin: 15mm; size: A4 portrait; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #ffffff;
      color: #111827;
      margin: 0;
      padding: 24px;
      line-height: 1.5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 28px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #059669;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .badge-doc {
      background: #fef2f2;
      color: #b91c1c;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      border: 1px solid #fecaca;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 12px 16px;
      margin-bottom: 18px;
      font-size: 13px;
    }
    .report-content {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 20px;
    }
    @media print {
      body { padding: 0; }
      .container { border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:24px;">🔬</span>
          <h1 style="margin:0; font-size:20px; font-weight:800; color:#064e3b;">${escapeHtml(title)}</h1>
        </div>
        <p style="margin:2px 0 0 0; font-size:12px; color:#059669; font-weight:600;">
          ${subTagline}
        </p>
      </div>
      <div>
        <span class="badge-doc">${badgeText}</span>
      </div>
    </div>

    <div class="info-grid">
      <div>
        <span style="color:#6b7280; font-size:11px; display:block;">${cropLabel}:</span>
        <strong style="color:#064e3b; font-size:15px;">${escapeHtml(data.cropName)}</strong>
      </div>
      <div>
        <span style="color:#6b7280; font-size:11px; display:block;">Timestamp:</span>
        <span style="color:#374151; font-weight:600;">${escapeHtml(now)}</span>
      </div>
    </div>

    ${data.notes ? `
    <div style="margin-bottom:18px; padding:10px 14px; background:#fffbeb; border-left:4px solid #f59e0b; border-radius:0 8px 8px 0; font-size:13px;">
      <strong>${notesLabel}:</strong> ${escapeHtml(data.notes)}
    </div>` : ''}

    ${imageSection}

    <div class="report-content">
      <div style="font-size:14px; font-weight:800; color:#065f46; margin-bottom:12px; border-bottom:1px solid #f1f5f9; padding-bottom:6px;">
        ${findingsLabel}
      </div>
      <div>
        ${formattedReport}
      </div>
    </div>

    <div style="margin-top:24px; padding-top:12px; border-top:1px dashed #cbd5e1; font-size:11px; color:#64748b; text-align:center;">
      <p style="margin:0 0 4px 0;"><strong>⚠️ Notice:</strong> ${safetyNotice}</p>
      <p style="margin:0; font-size:10px; color:#94a3b8;">${footerIssued}</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Generate standalone HTML for Farm Weather Bulletin
 */
export function generateWeatherBulletinHtml(data: WeatherBulletinData): string {
  const isTa = data.language === 'ta';
  const isTe = data.language === 'te';
  const isHi = data.language === 'hi';
  const locale = isTa ? 'ta-IN' : isTe ? 'te-IN' : isHi ? 'hi-IN' : 'en-IN';
  const now = data.timestamp || new Date().toLocaleString(locale, {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  let title = 'BhuMitra Farm Weather & Agricultural Bulletin';
  let locLabel = 'Farm District / Location';
  let cropWord = 'Crop';
  let humidityLabel = 'Humidity';
  let windLabel = 'Wind Speed';
  let rainLabel = 'Rain Chance';
  let sprayTitle = 'Spraying Window Advisory';
  let irrigTitle = 'Irrigation Advisory';
  let forecastTitle = '5-Day Agricultural Forecast';
  let thDay = 'Day';
  let thCond = 'Condition';
  let thMax = 'Max Temp';
  let thMin = 'Min Temp';
  let thRain = 'Rain %';
  let badgeLabel = 'Agri-Met Bulletin';
  let subTagline = '5-Day Agricultural Weather Advisory & Spray Planning';
  let footerText = 'Provided by BhuMitra AI Agri-Met Service • Plan fieldwork according to daily weather variations';

  if (isTa) {
    title = 'பூமித்ரா பண்ணை வானிலை புல்லட்டின்';
    locLabel = 'பண்ணை இருப்பிடம் / மாவட்டம்';
    cropWord = 'பயிர்';
    humidityLabel = 'ஈரப்பதம்';
    windLabel = 'காற்றின் வேகம்';
    rainLabel = 'மழை வாய்ப்பு';
    sprayTitle = 'மருந்து தெளிப்பு வழிகாட்டல்';
    irrigTitle = 'பாசன வழிகாட்டல்';
    forecastTitle = '5 நாட்கள் பண்ணை வானிலை முன்னறிவிப்பு';
    thDay = 'நாள்';
    thCond = 'வானிலை';
    thMax = 'அதிகபட்சம்';
    thMin = 'குறைந்தபட்சம்';
    thRain = 'மழை %';
    badgeLabel = 'வானிலை அறிக்கை';
    subTagline = '5 நாட்கள் வேளாண் வானிலை மற்றும் மருந்து தெளிப்பு வழிகாட்டி';
    footerText = 'பூமித்ரா AI வேளாண் வானிலை சேவை • வானிலைக்கு ஏற்ப பண்ணை பணிகளை திட்டமிடுங்கள்';
  } else if (isTe) {
    title = 'భూమిత్ర పొలం వాతావరణ బులెటిన్';
    locLabel = 'వ్యవసాయ ప్రాంతం / జిల్లా';
    cropWord = 'పంట';
    humidityLabel = 'తేమ శాతం';
    windLabel = 'గాలి వేగం';
    rainLabel = 'వర్ష సూచన';
    sprayTitle = 'మందులు పిచికారీ సలహా';
    irrigTitle = 'నీటి పారుదల సలహా';
    forecastTitle = '5 రోజుల వ్యవసాయ వాతావరణ నివేదిక';
    thDay = 'రోజు';
    thCond = 'వాతావరణం';
    thMax = 'గరిష్ట ఉష్ణోగ్రత';
    thMin = 'కనిష్ట ఉష్ణోగ్రత';
    thRain = 'వర్షం %';
    badgeLabel = 'వాతావరణ బులెటిన్';
    subTagline = '5 రోజుల వ్యవసాయ వాతావరణం మరియు పిచికారీ ప్రణాళిక';
    footerText = 'భూమిత్ర AI అగ్రి-మెట్ సర్వీస్ • రోజువారీ వాతావరణ పరిస్థితులకు అనుగుణంగా పనులు చేపట్టండి';
  } else if (isHi) {
    title = 'भूमिमित्र खेत मौसम बुलेटिन';
    locLabel = 'कृषि जिला / स्थान';
    cropWord = 'फसल';
    humidityLabel = 'नमी';
    windLabel = 'हवा की गति';
    rainLabel = 'बारिश की संभावना';
    sprayTitle = 'दवा छिड़काव अनुकूलता सलाह';
    irrigTitle = 'सिंचाई परामर्श';
    forecastTitle = '5 दिवसीय कृषि मौसम पूर्वानुमान';
    thDay = 'दिन';
    thCond = 'मौसम स्थिति';
    thMax = 'अधिकतम तापमान';
    thMin = 'न्यूनतम तापमान';
    thRain = 'बारिश %';
    badgeLabel = 'मौसम बुलेटिन';
    subTagline = '5 दिवसीय कृषि मौसम पूर्वानुमान एवं छिड़काव योजना';
    footerText = 'भूमिमित्र AI मौसम सेवा • दैनिक मौसम के अनुसार खेत के कार्यों की योजना बनाएं';
  }

  const forecastRows = data.forecastDays
    .map(
      (day) => `
    <tr style="border-bottom:1px solid #f1f5f9;">
      <td style="padding:10px; font-weight:600;">${escapeHtml(day.day)}</td>
      <td style="padding:10px; color:#374151;">${escapeHtml(day.condition)}</td>
      <td style="padding:10px; text-align:center; font-weight:700; color:#dc2626;">${day.maxTemp}°C</td>
      <td style="padding:10px; text-align:center; color:#2563eb;">${day.minTemp}°C</td>
      <td style="padding:10px; text-align:center; color:#059669; font-weight:600;">${day.rainChance}%</td>
    </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="${data.language}">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <style>
    @page { margin: 15mm; size: A4 portrait; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: #ffffff;
      color: #111827;
      margin: 0;
      padding: 24px;
      line-height: 1.5;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 28px;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .stat-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 14px;
      text-align: center;
    }
    .advisory-card {
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      padding: 12px 16px;
      border-radius: 0 10px 10px 0;
      margin-bottom: 16px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 14px;
      font-size: 13px;
    }
    th {
      background: #f1f5f9;
      padding: 10px;
      text-align: left;
      font-weight: 700;
      color: #475569;
    }
    @media print {
      body { padding: 0; }
      .container { border: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:24px;">⛅</span>
          <h1 style="margin:0; font-size:20px; font-weight:800; color:#0369a1;">${escapeHtml(title)}</h1>
        </div>
        <p style="margin:2px 0 0 0; font-size:12px; color:#0284c7; font-weight:600;">
          ${subTagline}
        </p>
      </div>
      <div style="text-align:right;">
        <span style="display:inline-block; background:#e0f2fe; color:#0369a1; padding:4px 10px; border-radius:9999px; font-size:11px; font-weight:700;">${badgeLabel}</span>
        <div style="font-size:11px; color:#6b7280; margin-top:4px;">${escapeHtml(now)}</div>
      </div>
    </div>

    <div style="margin-bottom:18px; padding:12px 16px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <span style="font-size:11px; color:#166534; display:block;">${locLabel}:</span>
        <strong style="font-size:16px; color:#065f46;">${escapeHtml(data.locationName)}</strong>
        ${data.cropName ? `<span style="font-size:12px; color:#047857; margin-left:8px;">(${cropWord}: ${escapeHtml(data.cropName)})</span>` : ''}
      </div>
      <div style="text-align:right;">
        <span style="font-size:22px; font-weight:800; color:#0f172a;">${data.temperature}°C</span>
        <div style="font-size:12px; color:#475569; font-weight:600;">${escapeHtml(data.condition)}</div>
      </div>
    </div>

    <!-- Quick stats -->
    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-bottom:18px;">
      <div class="stat-card">
        <div style="font-size:11px; color:#64748b;">${humidityLabel}</div>
        <div style="font-size:16px; font-weight:700; color:#0369a1;">${data.humidity}%</div>
      </div>
      <div class="stat-card">
        <div style="font-size:11px; color:#64748b;">${windLabel}</div>
        <div style="font-size:16px; font-weight:700; color:#0369a1;">${data.windSpeed} km/h</div>
      </div>
      <div class="stat-card">
        <div style="font-size:11px; color:#64748b;">${rainLabel}</div>
        <div style="font-size:16px; font-weight:700; color:#0369a1;">${data.rainChance}%</div>
      </div>
    </div>

    <!-- Spray & Irrigation Advisories -->
    <div class="advisory-card">
      <div style="font-size:13px; font-weight:700; color:#1e40af; margin-bottom:4px;">
        🧪 ${sprayTitle}:
      </div>
      <div style="font-size:13px; color:#1e3a8a;">${escapeHtml(data.sprayAdvisory)}</div>
    </div>

    <div class="advisory-card" style="background:#ecfdf5; border-left-color:#10b981;">
      <div style="font-size:13px; font-weight:700; color:#065f46; margin-bottom:4px;">
        💧 ${irrigTitle}:
      </div>
      <div style="font-size:13px; color:#064e3b;">${escapeHtml(data.irrigationAdvisory)}</div>
    </div>

    <!-- 5-Day Forecast Table -->
    <div style="margin-top:20px;">
      <div style="font-size:14px; font-weight:700; color:#334155; margin-bottom:6px;">
        📅 ${forecastTitle}
      </div>
      <table>
        <thead>
          <tr>
            <th>${thDay}</th>
            <th>${thCond}</th>
            <th style="text-align:center;">${thMax}</th>
            <th style="text-align:center;">${thMin}</th>
            <th style="text-align:center;">${thRain}</th>
          </tr>
        </thead>
        <tbody>
          ${forecastRows}
        </tbody>
      </table>
    </div>

    <div style="margin-top:24px; padding-top:12px; border-top:1px dashed #cbd5e1; font-size:11px; color:#64748b; text-align:center;">
      <p style="margin:0;">${footerText}</p>
    </div>
  </div>
</body>
</html>`;
}

// Helpers
function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatBoldHtml(str: string): string {
  const escaped = escapeHtml(str);
  return escaped.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#0f172a; font-weight:700;">$1</strong>');
}
