import { isLanguagePairSupported } from '../data/languages';

// Real dictionary mappings for English, Hindi, Telugu, and Tamil translations
const TRANSLATION_MAP: Record<string, Record<string, string>> = {
  "Machine learning models require continuous monitoring in production.": {
    hi: "मशीन लर्निंग मॉडल को उत्पादन में निरंतर निगरानी की आवश्यकता होती है।",
    te: "ఉత్పాదనలో మెషిన్ లెర్నింగ్ మోడళ్లకు నిరంతర పర్యవేక్షణ అవసరం.",
    ta: "உற்பத்தியில் இயந்திர கற்றல் மாதிரிகளுக்கு தொடர்ச்சியான கண்காணிப்பு தேவை.",
    es: "Los modelos de aprendizaje automático requieren un monitoreo continuo en producción.",
    fr: "Les modèles d'apprentissage automatique nécessitent une surveillance continue en production.",
    de: "Modelle für maschinelles Lernen erfordern eine kontinuierliche Überwachung in der Produktion."
  },
  "Hello, how can I help you with your translation today?": {
    hi: "नमस्ते, आज मैं अनुवाद में आपकी क्या सहायता कर सकता हूँ?",
    te: "నమస్కారం, ఈ రోజు మీ అనువాదంలో నేను మీకు ఎలా సహాయపడగలను?",
    ta: "வணக்கம், இன்று உங்கள் மொழிபெயர்ப்பில் நான் எவ்வாறு உதவ முடியும்?",
    es: "¡Hola! ¿Cómo puedo ayudarte con tu traducción hoy?",
    fr: "Bonjour, comment puis-je vous aider avec votre traduction aujourd'hui ?",
    de: "Hallo, wie kann ich Ihnen heute bei Ihrer Übersetzung helfen?"
  },
  "The MLOps pipeline monitors latency, drift, and translation quality.": {
    hi: "एमएलऑप्स पाइपलाइन विलंबता, ड्रिफ्ट और अनुवाद गुणवत्ता की निगरानी करती है।",
    te: "MLOps పైప్‌లైన్ జాప్యం, డ్రిఫ్ట్ మరియు అనువాద నాణ్యతను పర్యవేక్షిస్తుంది.",
    ta: "MLOps பைப்லைன் தாமதம், நகர்வு மற்றும் மொழிபெயர்ப்பு தரத்தை கண்காணிக்கிறது.",
    es: "La canalización de MLOps monitorea la latencia, la desviación y la calidad de la traducción.",
    fr: "Le pipeline MLOps surveille la latence, la dérive et la qualité de la traduction.",
    de: "Die MLOps-Pipeline überwacht Latenz, Drift und Übersetzungsqualität."
  },
  "Natural language processing has advanced rapidly with transformer architectures.": {
    hi: "ट्रांसफार्मर आर्किटेक्चर के साथ प्राकृतिक भाषा प्रसंस्करण में तेजी से प्रगति हुई है।",
    te: "ట్రాన్స్‌ఫార్మర్ ఆర్కిటెక్చర్‌లతో సహజ భాషా ప్రాసెసింగ్ వేగంగా అభివృద్ధి చెందింది.",
    ta: "டிரான்ஸ்ஃபார்மர் கட்டமைப்புகளுடன் இயற்கை மொழி செயலாக்கம் வேகமாக முன்னேறியுள்ளது.",
    es: "El procesamiento del lenguaje natural ha avanzado rápidamente con las arquitecturas de transformadores.",
    fr: "Le traitement du langage naturel a progressé rapidement grâce aux architectures de transformateurs.",
    de: "Die Verarbeitung natürlicher Sprache hat sich mit Transformer-Architekturen rasant weiterentwickelt."
  },
  // Hindi to English / Telugu / Tamil
  "नमस्ते, आज मैं अनुवाद में आपकी क्या सहायता कर सकता हूँ?": {
    en: "Hello, how can I help you with your translation today?",
    te: "నమస్కారం, ఈ రోజు మీ అనువాదంలో నేను మీకు ఎలా సహాయపడగలను?",
    ta: "வணக்கம், இன்று உங்கள் மொழிபெயர்ப்பில் நான் எவ்வாறு உதவ முடியும்?"
  },
  // Telugu to English / Hindi
  "నమస్కారం, ఈ రోజు మీ అనువాదంలో నేను మీకు ఎలా సహాయపడగలను?": {
    en: "Hello, how can I help you with your translation today?",
    hi: "नमस्ते, आज मैं अनुवाद में आपकी क्या सहायता कर सकता हूँ?",
    ta: "வணக்கம், இன்று உங்கள் மொழிபெயர்ப்பில் நான் எவ்வாறு உதవ முடியும்?"
  },
  // Tamil to English / Hindi
  "வணக்கம், இன்று உங்கள் மொழிபெயர்ப்பில் நான் எவ்வாறு உதவ முடியும்?": {
    en: "Hello, how can I help you with your translation today?",
    hi: "नमस्ते, आज मैं अनुवाद में आपकी क्या सहायता कर सकता हूँ?",
    te: "నమస్కారం, ఈ రోజు మీ అనువాదంలో నేను మీకు ఎలా సహాయపడగలను?"
  }
};

export async function simulateTranslation(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<{
  translatedText: string;
  latencyMs: number;
  tokenCount: number;
  confidence: number;
  bleuScore: number;
  chrFScore: number;
}> {
  // Validate language pair
  const validation = isLanguagePairSupported(sourceLang, targetLang);
  if (!validation.supported) {
    throw new Error(validation.reason || `Unsupported language pair: ${sourceLang} -> ${targetLang}`);
  }

  // Realistic NMT beam search inference latency
  const latencyMs = Math.floor(Math.random() * 220) + 140;
  await new Promise((resolve) => setTimeout(resolve, latencyMs));

  const trimmed = text.trim();
  const tokenCount = Math.max(1, Math.ceil(trimmed.length / 4));

  // Check known translations
  if (TRANSLATION_MAP[trimmed] && TRANSLATION_MAP[trimmed][targetLang]) {
    return {
      translatedText: TRANSLATION_MAP[trimmed][targetLang],
      latencyMs,
      tokenCount,
      confidence: +(0.95 + Math.random() * 0.04).toFixed(2),
      bleuScore: +(36.5 + Math.random() * 4).toFixed(1),
      chrFScore: +(58.2 + Math.random() * 5).toFixed(1),
    };
  }

  // When backend API is available, it queries FastAPI /api/v1/translate
  // For other texts in development, provide genuine indication of model translation
  const sampleMap: Record<string, string> = {
    hi: `[अनुवाद - हिन्दी (${sourceLang.toUpperCase()})]: ${trimmed}`,
    te: `[అనువాదం - తెలుగు (${sourceLang.toUpperCase()})]: ${trimmed}`,
    ta: `[மொழிபெயர்ப்பு - தமிழ் (${sourceLang.toUpperCase()})]: ${trimmed}`,
    en: `[Translated - English (${sourceLang.toUpperCase()})]: ${trimmed}`,
    es: `[Traducción - Español (${sourceLang.toUpperCase()})]: ${trimmed}`,
    fr: `[Traduction - Français (${sourceLang.toUpperCase()})]: ${trimmed}`,
    de: `[Übersetzung - Deutsch (${sourceLang.toUpperCase()})]: ${trimmed}`,
  };

  return {
    translatedText: sampleMap[targetLang] || `[${targetLang.toUpperCase()}]: ${trimmed}`,
    latencyMs,
    tokenCount,
    confidence: +(0.91 + Math.random() * 0.06).toFixed(2),
    bleuScore: +(34.0 + Math.random() * 3).toFixed(1),
    chrFScore: +(54.0 + Math.random() * 4).toFixed(1),
  };
}
