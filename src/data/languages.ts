import { Language } from '../types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
];

export const PRIMARY_LANGUAGES = ['en', 'hi', 'te', 'ta'];

// Pairs supported by the active NMT model
export const SUPPORTED_PAIRS = new Set([
  'en-hi', 'hi-en',
  'en-te', 'te-en',
  'en-ta', 'ta-en',
  'hi-te', 'te-hi',
  'hi-ta', 'ta-hi',
  'te-ta', 'ta-te',
  'en-es', 'es-en',
  'en-fr', 'fr-en',
  'en-de', 'de-en'
]);

export function isLanguagePairSupported(source: string, target: string): {
  supported: boolean;
  reason?: string;
} {
  if (source === target) {
    return {
      supported: false,
      reason: 'Source and target languages cannot be identical.'
    };
  }
  const pair = `${source}-${target}`;
  if (!SUPPORTED_PAIRS.has(pair)) {
    return {
      supported: false,
      reason: `Direct translation from ${source.toUpperCase()} to ${target.toUpperCase()} is not supported by the active model checkpoint. Supported directions include English, Hindi, Telugu, and Tamil pairs.`
    };
  }
  return { supported: true };
}

export const SAMPLE_PHRASES = [
  "Machine learning models require continuous monitoring in production.",
  "Hello, how can I help you with your translation today?",
  "The MLOps pipeline monitors latency, drift, and translation quality.",
  "Natural language processing has advanced rapidly with transformer architectures."
];
