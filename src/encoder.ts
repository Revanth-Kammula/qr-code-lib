import { ReedSolomon } from './errorCorrection';

export enum ErrorCorrectionLevel {
  L = 'L',
  M = 'M',
  Q = 'Q',
  H = 'H',
}

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
  static encodeToBinary(text: string, level: ErrorCorrectionLevel): string {
    let bitStream = QREncoder.MODE_INDICATOR.toString(2);

    // Convert length to binary (8-bit for version 1)
    const lengthBinary = text.length.toString(2).padStart(8, '0');
    bitStream += lengthBinary;

    // Convert each character to 8-bit binary
    const byteData: number[] = [];
    for (let i = 0; i < text.length; i++) {
      const binary = text.charCodeAt(i).toString(2).padStart(8, '0');
      bitStream += binary;
      byteData.push(text.charCodeAt(i));
    }

    // Compute error correction codewords
    const ecLevel = QREncoder.ERROR_CORRECTION_LEVELS[level];
    const ecCodewords = ReedSolomon.generateECCodewords(byteData, ecLevel);

    // Append error correction bits to the data
    ecCodewords.forEach(code => {
      bitStream += code.toString(2).padStart(8, '0');
    });

    // Append terminator bits if necessary
    const remainder = 8 - (bitStream.length % 8);
    if (remainder > 0 && remainder < 8) {
      bitStream += '0'.repeat(remainder);
    }

    return bitStream;
  }

  /**
   * Convert input text to binary (Byte Mode) using Uint8Array.
   * @param text - Input string to encode.
   * @param level - Error correction level (L, M, Q, H).
   * @returns Uint8Array bitstream.
   */
  static encodeToBinaryNew(text: string, level: ErrorCorrectionLevel): Uint8Array {
    const byteData = new Uint8Array(text.length + 2);
    // Mode indicator
    byteData[0] = QREncoder.MODE_INDICATOR;
    // Character count indicator
    byteData[1] = text.length;

    // Convert characters to bytes
    for (let i = 0; i < text.length; i++) {
      byteData[i + 2] = text.charCodeAt(i);
    }

    // Compute error correction
    const ecLevel = QREncoder.ERROR_CORRECTION_LEVELS[level];
    const ecCodewords = ReedSolomon.generateECCodewords(Array.from(byteData), ecLevel);

    return new Uint8Array([...byteData, ...ecCodewords]);
  }
}
