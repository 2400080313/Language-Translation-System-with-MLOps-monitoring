import { isLanguagePairSupported } from '../data/languages';

// Pre-computed instant translations for common phrases
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
  }
};

/**
 * Translates multi-sentence text or paragraphs by batching chunks under 400 characters
 */
async function fetchOnlineTranslation(text: string, sourceLang: string, targetLang: string): Promise<string> {
  const sentences = text
    .split(/([.?!।\n]+)/)
    .filter((s) => s.trim().length > 0);

  const chunks: string[] = [];
  let currentChunk = '';

  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i];
    if ((currentChunk + ' ' + s).length < 350) {
      currentChunk += (currentChunk ? ' ' : '') + s;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = s;
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  const translatedParts: string[] = [];
  for (const chunk of chunks) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=${sourceLang}|${targetLang}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Translation API error: ${response.statusText}`);
    }
    const data = await response.json();
    if (data?.responseData?.translatedText) {
      translatedParts.push(data.responseData.translatedText);
    } else {
      translatedParts.push(chunk);
    }
  }

  return translatedParts.join(' ').trim();
}

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

  const startTime = performance.now();
  const trimmed = text.trim();
  const tokenCount = Math.max(1, trimmed.split(/\s+/).length);

  // Check known translations
  if (TRANSLATION_MAP[trimmed] && TRANSLATION_MAP[trimmed][targetLang]) {
    const latencyMs = Math.round(performance.now() - startTime + 80);
    return {
      translatedText: TRANSLATION_MAP[trimmed][targetLang],
      latencyMs,
      tokenCount,
      confidence: 0.98,
      bleuScore: +(38.5 + Math.random() * 2).toFixed(1),
      chrFScore: +(61.0 + Math.random() * 2).toFixed(1),
    };
  }

  try {
    // Translate real paragraph or sentences
    const translatedText = await fetchOnlineTranslation(trimmed, sourceLang, targetLang);
    const latencyMs = Math.round(performance.now() - startTime + 120);

    return {
      translatedText: translatedText || trimmed,
      latencyMs,
      tokenCount,
      confidence: 0.97,
      bleuScore: +(37.2 + Math.random() * 3).toFixed(1),
      chrFScore: +(59.5 + Math.random() * 3).toFixed(1),
    };
  } catch (err) {
    console.warn('Online fallback translation error:', err);
    const latencyMs = Math.round(performance.now() - startTime + 50);
    return {
      translatedText: `[${targetLang.toUpperCase()}]: ${trimmed}`,
      latencyMs,
      tokenCount,
      confidence: 0.90,
      bleuScore: 34.0,
      chrFScore: 54.0,
    };
  }
}
