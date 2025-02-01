import { QRRenderer } from '../src/renderer';
import { QRMatrix } from '../src/matrix';
import { QREncoder } from '../src/encoder';

describe('QRRenderer', () => {
  let qrMatrix: number[][];

  beforeAll(() => {
    const encodedData = QREncoder.encodeToBinary('RenderTest', 'M');
    qrMatrix = new QRMatrix().generate(encodedData);
  });

  test('should render a canvas element', async () => {
    const canvas = await QRRenderer.renderToCanvasWithStyle(qrMatrix, 300, {
      foregroundColor: '#000',
      backgroundColor: '#fff',
    });

    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    expect(canvas.width).toBe(300);
    expect(canvas.height).toBe(300);
  });

  test('should render SVG output as a string', () => {
    const svgString = QRRenderer.renderToSVG(qrMatrix, 300);
    expect(svgString.startsWith('<svg')).toBeTruthy();
    expect(svgString.includes('<rect')).toBeTruthy();
  });

  test('should correctly export a PNG Blob', async () => {
    const canvas = await QRRenderer.renderToCanvasWithStyle(qrMatrix, 300, {});
    const blob = await QRRenderer.exportCanvasAsImage(canvas, 'png');

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('image/png');
  });
});
