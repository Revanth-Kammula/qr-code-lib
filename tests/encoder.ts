import { QREncoder } from '../src/encoder';

describe('QREncoder', () => {
  test('should encode text to binary bitstream (Byte Mode)', () => {
    const bitstream = QREncoder.encodeToBinary('Hello', 'M');
    expect(bitstream).toMatch(/0100[01]{8}[01]{40}/); // Checks if it starts with mode indicator and contains valid bits
  });

  test('should include the correct length indicator', () => {
    const bitstream = QREncoder.encodeToBinary('Test', 'M');
    const lengthBinary = '00000100'; // 'Test' has 4 characters in byte mode
    expect(bitstream).toContain(lengthBinary);
  });

  test('should generate error correction bits', () => {
    const bitstream = QREncoder.encodeToBinary('ErrorCheck', 'H');
    expect(bitstream.length).toBeGreaterThan(80); // Expect extra bits for error correction
  });
});
