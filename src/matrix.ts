export class QRMatrix {
  private static readonly SIZE = 21;
  private matrix: number[][];

  constructor() {
    this.matrix = Array(QRMatrix.SIZE).fill(null).map(() => Array(QRMatrix.SIZE).fill(0));
  }

  generate(bitStream: Uint8Array): number[][] {
    return this.matrix;
  }
}