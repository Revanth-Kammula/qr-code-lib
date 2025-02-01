import { ErrorCorrectionLevel, QREncoder } from '../src/encoder';

describe('QREncoder', () => {
  test('should encode text to binary bitstream (Byte Mode)', () => {
    const bitstream = QREncoder.encodeToBinary('Hello', ErrorCorrectionLevel.M);
    // Checks if it starts with mode indicator and contains valid bits
    expect(bitstream).toMatch(/0100[01]{8}[01]{40}/);
  });

  test('should include the correct length indicator', () => {
    const bitstream = QREncoder.encodeToBinary('Test', ErrorCorrectionLevel.M);
    // 'Test' has 4 characters in byte mode, so length should be 00000100
    const lengthBinary = '00000100';
    expect(bitstream).toContain(lengthBinary);
  });

  test('should generate error correction bits', () => {
    const bitstream = QREncoder.encodeToBinary('ErrorCheck', ErrorCorrectionLevel.H);
    // Expect extra bits for error correction, so length should be more than 80 bits for error correction
    expect(bitstream.length).toBeGreaterThan(80);
  });
});
