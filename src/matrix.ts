/**
 * QR Matrix Builder: Constructs the QR grid with finder patterns, timing patterns, and encoded data.
 */
export class QRMatrix {
  // QR Version 1 (21x21 matrix)
  private static readonly SIZE = 21;
  private readonly matrix: number[][];

  constructor() {
    this.matrix = Array(QRMatrix.SIZE)
      .fill(null)
      .map(() => Array(QRMatrix.SIZE).fill(0));
  }

  /**
   * Add finder patterns (3 large squares in corners)
   */
  private addFinderPatterns() {
    const positions = [
      [0, 0], // Top-left
      [0, QRMatrix.SIZE - 7], // Top-right
      [QRMatrix.SIZE - 7, 0], // Bottom-left
    ];

      positions.forEach(([row, col]) => this.addFinderPattern(row, col));
    }

    /**
     * Add a single finder pattern at the specified position
     */
  private addFinderPattern(row: number, col: number) {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        this.matrix[row + y][col + x] = this.isBorder(x, y) || this.isInner(x, y) ? 1 : 0;
      }
    }
  }

  private isBorder(x: number, y: number): boolean {
    return x === 0 || y === 0 || x === 6 || y === 6;
  }

  private isInner(x: number, y: number): boolean {
    return x >= 2 && x <= 4 && y >= 2 && y <= 4;
  }

  /**
   * Add timing patterns (alternating black/white lines)
   */
  private addTimingPatterns() {
    for (let i = 8; i < QRMatrix.SIZE - 8; i++) {
      this.matrix[6][i] = i % 2 === 0 ? 1 : 0;
      this.matrix[i][6] = i % 2 === 0 ? 1 : 0;
    }
  }

  /**
   * Place encoded data into the QR grid.
   * @param bitStream - The encoded binary string
   */
  private addData(bitStream: string) {
    let bitIndex = 0;
    for (let col = QRMatrix.SIZE - 1; col > 0; col -= 2) {
      for (let row = 0; row < QRMatrix.SIZE; row++) {
      if (col !== 6 && this.matrix[row][col] === 0 && bitIndex < bitStream.length) {
        const bit = bitStream[bitIndex];
        bitIndex++;
        this.matrix[row][col] = bit === '1' ? 1 : 0;
      }
    }
  }
}

  /**
   * Generate the final QR matrix
   * @param bitStream - Encoded binary data
   * @returns 2D matrix of the QR code
   */
  generate(bitStream: string): number[][] {
    this.addFinderPatterns();
    this.addTimingPatterns();
    this.addData(bitStream);
    return this.matrix;
  }
}
