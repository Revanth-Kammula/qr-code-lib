import { ErrorCorrectionLevel } from './encoder';

export class ReedSolomon {
  private static GF256_EXP = new Uint8Array(512);
  private static GF256_LOG = new Uint8Array(256);

  // Lazy initialize Galois Field tables (only once)
  private static initializeGaloisField(): void {
    // Already initialized
    if (this.GF256_EXP[0] !== 0) {
      return;
    }

    let x = 1;
    for (let i = 0; i < 256; i++) {
      this.GF256_EXP[i] = x;
      this.GF256_LOG[x] = i;
      x = (x * 2) ^ (x >= 128 ? 0x11d : 0);
    }
    for (let i = 256; i < 512; i++) {
      this.GF256_EXP[i] = this.GF256_EXP[i - 256];
    }
  }

  /**
   * Multiplies two numbers in GF(256)
   */
  private static gfMultiply(a: number, b: number): number {
    if (a === 0 || b === 0) {
      return 0;
    }
    return this.GF256_EXP[(this.GF256_LOG[a] + this.GF256_LOG[b]) % 255];
  }

  /**
   * Generates the generator polynomial for Reed-Solomon encoding.
   * @param degree - Number of error correction codewords required.
   */
  private static generateGeneratorPolynomial(degree: number): number[] {
    const poly = [1];
    for (let i = 0; i < degree; i++) {
      poly.push(0);
    }

    for (let i = 0; i < degree; i++) {
      for (let j = poly.length - 1; j > 0; j--) {
        poly[j] = this.gfMultiply(poly[j], this.GF256_EXP[i]) ^ poly[j - 1];
      }
      poly[0] = this.gfMultiply(poly[0], this.GF256_EXP[i]);
    }
    return poly;
  }

  /**
   * Generate Reed-Solomon error correction codewords efficiently.
   * @param data - Input data as an array of bytes.
   * @param numECWords - Number of error correction codewords.
   */
  static generateECCodewords(data: number[], numECWords: number): Uint8Array {
    this.initializeGaloisField();

    const generator = this.generateGeneratorPolynomial(numECWords);
    const ecc = new Uint8Array(numECWords);

    for (const element of data) {
      const factor = element ^ ecc[0];
      // Shift elements left
      ecc.set(ecc.slice(1));
      ecc[numECWords - 1] = 0;

      if (factor !== 0) {
        for (let j = 0; j < numECWords; j++) {
          ecc[j] ^= this.gfMultiply(generator[j], factor);
        }
      }
    }

    return ecc;
  }

  /**
   * Generates error correction bits (simplified example)
   * @param data - Input data as binary string
   * @param level - Error correction level (L, M, Q, H)
   * @returns Error correction codewords
   */
  static generateErrorCorrection(data: string, _level: ErrorCorrectionLevel): string {
    // Placeholder: Just returning 16 redundant bits (should use proper Reed-Solomon encoding)
    const errorBits = '1010101010101010';
    return data + errorBits;
  }
}
