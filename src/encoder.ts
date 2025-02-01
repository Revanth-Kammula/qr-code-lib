

import { ReedSolomon } from './errorCorrection';

/**
 * QR Encoder: Converts input text into binary bitstream with error correction.
 */
export class QREncoder {
  // Byte Mode indicator in QR
  private static readonly MODE_INDICATOR = 0b0100;
  private static readonly ERROR_CORRECTION_LEVELS = { L: 7, M: 15, Q: 25, H: 30 };

  /**
   * Convert input text to binary (Byte Mode) and add error correction.
   * @param text - Input string to encode.
   * @param level - Error correction level (L, M, Q, H).
   * @returns Binary bitstream string.
   */
  static encodeToBinary(text: string, level: 'L' | 'M' | 'Q' | 'H'): string {
    let bitStream = QREncoder.MODE_INDICATOR;

    // Convert length to binary (8-bit for version 1)
    const lengthBinary = text.length.toString(2).padStart(8, '0');
    bitStream += lengthBinary;

    // Convert each character to 8-bit binary
    let byteData: number[] = [];
    for (let i = 0; i < text.length; i++) {
      const binary = text.charCodeAt(i).toString(2).padStart(8, '0');
      bitStream += binary;
      byteData.push(text.charCodeAt(i));
    }

    // Compute error correction codewords
    const ecLevel = QREncoder.ERROR_CORRECTION_LEVELS[level];
    const ecCodewords = ReedSolomon.generateECCodewords(byteData, ecLevel);

    // Append error correction bits to the data
    ecCodewords.forEach((code) => {
      bitStream += code.toString(2).padStart(8, '0');
    });

    // Append terminator bits if necessary
    const remainder = 8 - (bitStream.length % 8);
    if (remainder > 0 && remainder < 8) {
      bitStream += '0'.repeat(remainder);
    }

    return bitStream;
  }

  static encodeToBinaryOld(text: string, level: 'L' | 'M' | 'Q' | 'H'): Uint8Array {
    const byteData = new Uint8Array(text.length + 2);
    // Mode indicator
    byteData[0] = QREncoder.MODE_INDICATOR;
    // Character count indicator
    byteData[1] = text.length;

    for (let i = 0; i < text.length; i++) {
      byteData[i + 2] = text.charCodeAt(i);
    }

    return byteData;
  }
}
