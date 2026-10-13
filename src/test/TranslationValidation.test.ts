import { describe, it, expect } from 'vitest';
import { isLanguagePairSupported, SUPPORTED_LANGUAGES } from '../data/languages';
import { simulateTranslation } from '../utils/mockTranslate';

describe('Language Support and Validation', () => {
  it('should include English, Hindi, Telugu, and Tamil', () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toContain('en');
    expect(codes).toContain('hi');
    expect(codes).toContain('te');
    expect(codes).toContain('ta');
  });

  it('should validate supported language pairs', () => {
    expect(isLanguagePairSupported('en', 'hi').supported).toBe(true);
    expect(isLanguagePairSupported('en', 'te').supported).toBe(true);
    expect(isLanguagePairSupported('en', 'ta').supported).toBe(true);
    expect(isLanguagePairSupported('hi', 'te').supported).toBe(true);
  });

  it('should reject identical source and target languages', () => {
    const res = isLanguagePairSupported('en', 'en');
    expect(res.supported).toBe(false);
    expect(res.reason).toContain('identical');
  });

  it('should simulate translation with telemetry metrics', async () => {
    const res = await simulateTranslation(
      'Machine learning models require continuous monitoring in production.',
      'en',
      'hi'
    );
    expect(res.translatedText).toBeTruthy();
    expect(res.latencyMs).toBeGreaterThan(0);
    expect(res.confidence).toBeGreaterThan(0.5);
    expect(res.bleuScore).toBeGreaterThan(30);
  });
});
