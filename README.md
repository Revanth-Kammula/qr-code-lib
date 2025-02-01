# QR Code Generator (qr-code-lib)
A customizable QR code generator in **pure JavaScript & TypeScript**.

## 📥 Installation
```
npm install qr-code-lib
```

## 🚀 Usage
```typescript
import { QRCode } from "qr-code-lib";

async function generateQR() {
  const qr = new QRCode("Hello, World!", "M");
  document.body.appendChild(await qr.toCanvas(300));
}

generateQR();
```
