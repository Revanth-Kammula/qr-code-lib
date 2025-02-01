import { QRMatrix } from '../src/matrix';
import { ErrorCorrectionLevel, QREncoder } from '../src/encoder';

describe('QRMatrix', () => {
  test('should generate a valid QR matrix with finder patterns', () => {
    const encodedData = QREncoder.encodeToBinary(
      'MatrixTest',
      ErrorCorrectionLevel.L
    );
    const qrMatrix = new QRMatrix().generate(encodedData);

    // QR Version 1 (21x21)
    expect(qrMatrix.length).toBe(21);
    // Finder pattern check
    expect(qrMatrix[0][0]).toBe(1);
    // Finder pattern edges
    expect(qrMatrix[0][6]).toBe(1);
  });

  test('should contain timing patterns', () => {
    const encodedData = QREncoder.encodeToBinary(
      'TimingTest',
      ErrorCorrectionLevel.L
    );
    const qrMatrix = new QRMatrix().generate(encodedData);

    for (let i = 8; i < 21 - 8; i++) {
      // Alternating pattern
      expect(qrMatrix[6][i] % 2).toBe(i % 2);
      expect(qrMatrix[i][6] % 2).toBe(i % 2);
    }
  });
});
