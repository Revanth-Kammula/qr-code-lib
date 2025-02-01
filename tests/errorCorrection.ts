import { ReedSolomon } from '../src/errorCorrection';

describe('ReedSolomon', () => {
  test('should generate correct number of error correction codewords', () => {
    const data = [32, 65, 70, 73, 80, 82];
    const ecCodewords = ReedSolomon.generateECCodewords(data, 10);
    expect(ecCodewords.length).toBe(10);
  });

  test('should produce non-zero error correction values', () => {
    const data = [5, 10, 20, 30, 40];
    const ecCodewords = ReedSolomon.generateECCodewords(data, 5);
    expect(ecCodewords.some((code) => code !== 0)).toBeTruthy();
  });
});
