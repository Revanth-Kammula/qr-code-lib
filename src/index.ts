import { QREncoder } from './encoder';
import { QRMatrix } from './matrix';
import { QRRenderer } from './renderer';

/**
 * QRCode: Main class for generating QR codes.
 */
export class QRCode {
  private readonly matrix: number[][];

  constructor(private readonly text: string, private readonly errorCorrection: 'L' | 'M' | 'Q' | 'H' = 'M') {
    const encodedData = QREncoder.encodeToBinary(this.text, this.errorCorrection);
    this.matrix = new QRMatrix().generate(encodedData);
  }

  async toCanvas(size: number): Promise<HTMLCanvasElement> {
    return QRRenderer.renderToCanvasWithStyle(this.matrix, size, {});
  }

  toSVG(size: number): string {
    return QRRenderer.renderToSVG(this.matrix, size);
  }

  async saveAs(format: 'png' | 'jpeg' | 'svg', size: number, fileName: string) {
    if (format === 'svg') {
      const svgString = this.toSVG(size);
      QRRenderer.saveSVG(svgString, fileName);
    } else {
      const canvas = await this.toCanvas(size);
      const blob = await QRRenderer.exportCanvasAsImage(canvas, format);
      QRRenderer.saveImage(blob as Blob, fileName);
    }
  }
}