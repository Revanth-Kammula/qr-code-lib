import { QRCode } from 'qr-code-lib';

async function generateQR() {
  const qr = new QRCode('Hello, World!', 'M');

  // Render to Canvas
  const canvas = await qr.toCanvas(300, {
    foregroundColor: '#000',
    backgroundColor: '#fff',
    dotShape: 'rounded',
    logoSrc: 'https://example.com/logo.png',
  });
  document.body.appendChild(canvas);

  // Save as PNG
  await qr.saveAs('png', 300, 'my-qr-code.png');

  // Export as SVG
  await qr.saveAs('svg', 300, 'my-qr-code.svg');
}

generateQR();
