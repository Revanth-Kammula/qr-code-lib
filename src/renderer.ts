type Shape = 'square' | 'circle' | 'rounded';

export interface QRCodeOptions {
  // Color of the QR dots
  foregroundColor?: string;
  backgroundColor?: string;
  // Finder pattern style (eye shape)
  dotShape?: Shape;
  // Finder pattern style (eye shape)
  eyeShape?: Shape;
  // Optional gradient for the QR code
  gradient?: { start: string; end: string; type: 'linear' | 'radial' };
  // Optional logo image URL
  logoSrc?: string;
  // Logo size relative to QR (default: 0.2)
  logoSizeRatio?: number;
}

const CANVAS_ERROR_CONTEXT = 'Failed to get 2D context';
export class QRRenderer {
  /**
   * Render QR code to Canvas with custom styling and optional logo.
   * @param matrix - QR Matrix (2D array)
   * @param size - Canvas size in pixels
   * @param options - Styling options for QR code
   * @returns HTMLCanvasElement
   */
  static async renderToCanvasWithStyle(
    matrix: number[][],
    size: number,
    options: QRCodeOptions = {},
  ): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    // Disable alpha for better performance
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) {
      throw new Error(CANVAS_ERROR_CONTEXT);
    }
    const cellSize = size / matrix.length;
    const {
      foregroundColor = 'black',
      backgroundColor = 'white',
      dotShape = 'square',
      eyeShape = 'square',
      logoSrc,
      logoSizeRatio = 0.2,
      gradient,
    } = options;

    canvas.width = size;
    canvas.height = size;

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);

    // Create gradient if enabled
    if (gradient) {
      const grad =
        gradient.type === 'linear'
          ? ctx.createLinearGradient(0, 0, size, size)
          : ctx.createRadialGradient(size / 2, size / 2, size / 4, size / 2, size / 2, size / 1.5);
      grad.addColorStop(0, gradient.start);
      grad.addColorStop(1, gradient.end);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = foregroundColor;
    }
    ctx.beginPath();
    // Draw QR code dots with selected shape
    matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          switch (dotShape) {
            case 'circle':
              this.drawCircle(ctx, x * cellSize, y * cellSize, cellSize);
              break;
            case 'rounded':
              this.drawRoundedRect(ctx, x * cellSize, y * cellSize, cellSize, 4);
              break;
            default:
              ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
              break;
          }
        }
      });
    });
    ctx.fill();
    // Draw finder (eye) patterns with different styles
    this.drawEyePattern(ctx, matrix, cellSize, eyeShape);

    // Add logo if provided
    if (!logoSrc) return canvas;

    return new Promise((resolve, reject) => {
      const logo = new Image();
      logo.crossOrigin = 'anonymous';
      logo.src = logoSrc;
      logo.onload = () => {
        const logoSize = size * logoSizeRatio;
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;

        ctx.fillStyle = 'white';
        ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
        resolve(canvas);
      };
      logo.onerror = reject;
    });
  }

  /**
   * Draws a circular dot in the QR code.
   */
  private static drawCircle(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  /**
   * Draws a rounded rectangle for QR dots.
   */
  private static drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    radius: number,
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + size, y, x + size, y + size, radius);
    ctx.arcTo(x + size, y + size, x, y + size, radius);
    ctx.arcTo(x, y + size, x, y, radius);
    ctx.arcTo(x, y, x + size, y, radius);
    ctx.fill();
  }

  /**
   * Draws the eye (finder) patterns with different styles.
   */
  private static drawEyePattern(
    ctx: CanvasRenderingContext2D,
    matrix: number[][],
    cellSize: number,
    style: Shape,
  ) {
    const positions = [
      [0, 0],
      [0, matrix.length - 7],
      [matrix.length - 7, 0],
    ];

    positions.forEach(([row, col]) => {
      switch (style) {
        case 'circle':
          this.drawCircle(ctx, col * cellSize, row * cellSize, cellSize * 7);
          break;
        case 'rounded':
          this.drawRoundedRect(ctx, col * cellSize, row * cellSize, cellSize * 7, 8);
          break;
        default:
          ctx.fillRect(col * cellSize, row * cellSize, cellSize * 7, cellSize * 7);
          break;
      }
    });
  }

  /**
   * Render QR code to Canvas
   * @param matrix - QR Matrix (2D array)
   * @param size - Canvas size in pixels
   * @returns HTMLCanvasElement
   */
  static renderToCanvas(matrix: number[][], size: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error(CANVAS_ERROR_CONTEXT);
    }
    const cellSize = size / matrix.length;

    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = 'black';

    matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      });
    });

    return canvas;
  }

  /**
   * Render QR code to SVG
   * @param matrix - QR Matrix (2D array)
   * @param size - SVG size in pixels
   * @returns SVG string
   */
  static renderToSVG(matrix: number[][], size: number): string {
    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${matrix.length} ${matrix.length}">`;
    matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="black"/>`;
      });
    });
    return svg + '</svg>';
  }

  /**
   * Saves the QR code SVG as a file.
   * @param svgString - SVG content
   * @param fileName - Output file name
   */
  static saveSVG(svgString: string, fileName: string) {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    this.saveImage(blob, fileName);
  }

  /**
   * Converts the QR code canvas to an image format (PNG, JPEG, Base64).
   * @param canvas - The QR canvas
   * @param format - Image format ("png", "jpeg", "base64")
   * @param quality - Image quality (0 to 1, only for JPEG)
   * @returns Blob or Base64 string
   */
  static async exportCanvasAsImage(
    canvas: HTMLCanvasElement,
    format: 'png' | 'jpeg' | 'base64',
    quality = 1,
  ): Promise<Blob | string> {
    return new Promise((resolve, reject) => {
      if (format === 'base64') {
        resolve(canvas.toDataURL('image/png'));
      } else {
        canvas.toBlob(
          blob => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to generate image'));
          },
          `image/${format}`,
          quality,
        );
      }
    });
  }

  /**
   * Saves the QR code image file.
   * @param blob - Image Blob
   * @param fileName - Name of the output file
   */
  static saveImage(blob: Blob, fileName: string) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  /**
   * Render QR code to Canvas with an optional logo.
   * @param matrix - QR Matrix (2D array)
   * @param size - Canvas size in pixels
   * @param logoSrc - Optional logo image URL
   * @param logoSizeRatio - Logo size relative to QR (default: 0.2)
   * @returns HTMLCanvasElement
   */
  static async renderToCanvasWithLogo(
    matrix: number[][],
    size: number,
    logoSrc?: string,
    logoSizeRatio = 0.2,
  ): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error(CANVAS_ERROR_CONTEXT);
    }
    const cellSize = size / matrix.length;

    canvas.width = size;
    canvas.height = size;

    // Draw QR code grid
    ctx.fillStyle = 'black';
    matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      });
    });

    // If no logo is provided, return the canvas immediately
    if (!logoSrc) {
      return canvas;
    }

    // Load and draw the logo
    return new Promise((resolve, reject) => {
      const logo = new Image();
      // Handle CORS for external images
      logo.crossOrigin = 'anonymous';
      logo.src = logoSrc;
      logo.onload = () => {
        // Calculate logo size (default 20% of QR size)
        const logoSize = size * logoSizeRatio;
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;

        // Draw white background behind the logo to ensure QR readability
        ctx.fillStyle = 'white';
        ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

        // Draw the logo
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

        resolve(canvas);
      };
      logo.onerror = reject;
    });
  }

  /**
   * Render QR code to SVG with an optional logo (Base64 Image).
   * @param matrix - QR Matrix (2D array)
   * @param size - SVG size in pixels
   * @param logoSrc - Optional logo image (Base64 encoded)
   * @param logoSizeRatio - Logo size relative to QR (default: 0.2)
   * @returns SVG string
   */
  static renderToSVGWithLogo(
    matrix: number[][],
    size: number,
    logoSrc?: string,
    logoSizeRatio = 0.2,
  ): string {
    let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${matrix.length} ${matrix.length}" xmlns="http://www.w3.org/2000/svg">`;

    matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          svg += `<rect x="${x}" y="${y}" width="1" height="1" fill="black"/>`;
        }
      });
    });

    // If a logo is provided, embed it in the center
    if (logoSrc) {
      const logoSize = matrix.length * logoSizeRatio;
      const logoX = (matrix.length - logoSize) / 2;
      const logoY = (matrix.length - logoSize) / 2;

      svg += `<image href="${logoSrc}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid slice"/>`;
    }

    svg += `</svg>`;
    return svg;
  }
}
