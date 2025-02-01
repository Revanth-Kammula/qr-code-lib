export class QRRenderer {
  static async renderToCanvasWithStyle(
    matrix: number[][],
    size: number
  ): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, size, size);
    
    return canvas;
  }

  static renderToSVG(matrix: number[][], size: number): string {
    return `<svg width='${size}' height='${size}'></svg>`;
  }

  static saveSVG(svgString: string, fileName: string) {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
  }

  static async exportCanvasAsImage(
    canvas: HTMLCanvasElement,
    format: 'png' | 'jpeg'
  ): Promise<Blob> {
    return new Promise(resolve => {
      canvas.toBlob(blob => resolve(blob!), `image/${format}`);
    });
  }

  static saveImage(blob: Blob, fileName: string) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}