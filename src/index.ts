import { ErrorCorrectionLevel, QREncoder } from './encoder';
import { QRMatrix } from './matrix';
import { QRCodeOptions, QRRenderer } from './renderer';

/**
 * QRCode: Main class for generating QR codes.
 */
export class QRCode {
  private readonly matrix: number[][];

  constructor(
    private readonly text: string,
    private readonly errorCorrection: ErrorCorrectionLevel = ErrorCorrectionLevel.M,
  ) {
    const encodedData = QREncoder.encodeToBinary(this.text, this.errorCorrection);
    this.matrix = new QRMatrix().generate(encodedData);
  }

  /**
   * Renders the QR code as a styled Canvas.
   * @param size - Canvas size in pixels.
   * @param options - Styling options.
   * @returns A Promise resolving to an HTMLCanvasElement.
   */
  async toCanvas(size: number, options?: QRCodeOptions): Promise<HTMLCanvasElement> {
    return QRRenderer.renderToCanvasWithStyle(this.matrix, size, options || {});
  }

  /**
   * Renders the QR code as an SVG string.
   * @param size - SVG size in pixels.
   * @returns The SVG string.
   */
  toSVG(size: number): string {
    return QRRenderer.renderToSVG(this.matrix, size);
  }

  /**
   * Exports the QR code as an image (PNG, JPEG, or Base64).
   * @param format - Image format ("png", "jpeg", "base64").
   * @param size - Image size in pixels.
   * @param quality - Quality (0-1, applicable for JPEG).
   * @returns A Promise resolving to a Blob or Base64 string.
   */
  async exportAsImage(
    format: 'png' | 'jpeg' | 'base64',
    size: number,
    quality = 1,
  ): Promise<Blob | string> {
    const canvas = await this.toCanvas(size);
    return QRRenderer.exportCanvasAsImage(canvas, format, quality);
  }

  /**
   * Saves the QR code as an image file.
   * @param format - Image format ("png", "jpeg", "svg").
   * @param size - Image size in pixels.
   * @param fileName - Output file name.
   */
  async saveAs(format: 'png' | 'jpeg' | 'svg', size: number, fileName: string) {
    if (format === 'svg') {
      const svgString = this.toSVG(size);
      QRRenderer.saveSVG(svgString, fileName);
    } else {
      const blob = await this.exportAsImage(format, size);
      QRRenderer.saveImage(blob as Blob, fileName);
    }
  }
}
