# QR Code Generator (qr-code-lib)
A customizable QR code generator in **pure JavaScript & TypeScript**.

## 📌 Features
✔ Customizable **colors, gradients, dot shapes**
✔ Supports **logos in center** of the QR
✔ **Reed-Solomon error correction** for robustness
✔ **Exports as PNG, JPEG, SVG, Base64**
✔ **Zero dependencies** (Pure JavaScript)

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
  await qr.saveAs("png", 300, "my-qr-code.png");
}

generateQR();
```

## Customization
```typescript
import { QRCode } from "qr-code-lib";

async function generateQR() {
  const qr = new QRCode("Styled QR", "H");
  document.body.appendChild(await qr.toCanvas(300, {
    foregroundColor: "#FF5733",
    backgroundColor: "#EEE",
    dotShape: "rounded",
    eyeShape: "circle",
    gradient: { start: "#FF5733", end: "#900C3F", type: "radial" },
    logoSrc: "https://example.com/logo.png",
  }));
}

generateQR();
```
