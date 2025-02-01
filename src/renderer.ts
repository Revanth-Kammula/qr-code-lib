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
    options: {
      foregroundColor?: string; // Color of the QR dots
      backgroundColor?: string; // Background color
      dotShape?: "square" | "circle" | "rounded"; // Dot shape style
      eyeShape?: "square" | "circle" | "rounded"; // Finder pattern style
      gradient?: { start: string; end: string; type: "linear" | "radial" }; // Optional gradient
      logoSrc?: string; // Optional logo image URL
      logoSizeRatio?: number; // Logo size relative to QR (default: 0.2)
    } = {}
  ): Promise<HTMLCanvasElement> {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const cellSize = size / matrix.length;
    const { foregroundColor = "black", backgroundColor = "white", dotShape = "square", eyeShape = "square", logoSrc, logoSizeRatio = 0.2, gradient } = options;

    canvas.width = size;
    canvas.height = size;

    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, size, size);

    // Create gradient if enabled
    if (gradient) {
      const grad = gradient.type === "linear"
        ? ctx.createLinearGradient(0, 0, size, size)
        : ctx.createRadialGradient(size / 2, size / 2, size / 4, size / 2, size / 2, size / 1.5);
      grad.addColorStop(0, gradient.start);
      grad.addColorStop(1, gradient.end);
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = foregroundColor;
    }

    // Draw QR code dots with selected shape
    matrix.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell) {
          switch (dotShape) {
            case "circle":
              this.drawCircle(ctx, x * cellSize, y * cellSize, cellSize);
              break;
            case "rounded":
              this.drawRoundedRect(ctx, x * cellSize, y * cellSize, cellSize, 4);
              break;
            default:
              ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
              break;
          }
        }
      });
    });

    // Draw finder (eye) patterns with different styles
    this.drawEyePattern(ctx, matrix, cellSize, eyeShape);

    // Add logo if provided
    if (!logoSrc) return canvas;

    return new Promise((resolve, reject) => {
      const logo = new Image();
      logo.crossOrigin = "anonymous";
      logo.src = logoSrc;
      logo.onload = () => {
        const logoSize = size * logoSizeRatio;
        const logoX = (size - logoSize) / 2;
        const logoY = (size - logoSize) / 2;

        ctx.fillStyle = "white";
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
  private static drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, radius: number) {
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
  private static drawEyePattern(ctx: CanvasRenderingContext2D, matrix: number[][], cellSize: number, style: "square" | "circle" | "rounded") {
    const positions = [
      [0, 0],
      [0, matrix.length - 7],
      [matrix.length - 7, 0],
    ];

    positions.forEach(([row, col]) => {
      switch (style) {
        case "circle":
          this.drawCircle(ctx, col * cellSize, row * cellSize, cellSize * 7);
          break;
        case "rounded":
          this.drawRoundedRect(ctx, col * cellSize, row * cellSize, cellSize * 7, 8);
          break;
        default:
          ctx.fillRect(col * cellSize, row * cellSize, cellSize * 7, cellSize * 7);
          break;
      }
    });
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
      throw new Error('Failed to get 2D context');
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