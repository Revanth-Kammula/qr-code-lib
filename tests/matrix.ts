import { QRMatrix } from '../src/matrix';
import { QREncoder } from '../src/encoder';

describe('QRMatrix', () => {
  test('should generate a valid QR matrix with finder patterns', () => {
    const encodedData = QREncoder.encodeToBinary('MatrixTest', 'L');
    const qrMatrix = new QRMatrix().generate(encodedData);

    expect(qrMatrix.length).toBe(21); // QR Version 1 (21x21)
    expect(qrMatrix[0][0]).toBe(1); // Finder pattern check
    expect(qrMatrix[0][6]).toBe(1); // Finder pattern edge
  });

  test('should contain timing patterns', () => {
    const encodedData = QREncoder.encodeToBinary('TimingTest', 'L');
    const qrMatrix = new QRMatrix().generate(encodedData);

    for (let i = 8; i < 21 - 8; i++) {
      expect(qrMatrix[6][i] % 2).toBe(i % 2); // Alternating pattern
      expect(qrMatrix[i][6] % 2).toBe(i % 2);
    }
  });
});
