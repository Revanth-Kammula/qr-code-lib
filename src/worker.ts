import { QREncoder } from './encoder';
import { QRMatrix } from './matrix';

self.onmessage = (event: MessageEvent) => {
  const { text, level } = event.data;
  const encodedData = QREncoder.encodeToBinary(text, level);
  const matrix = new QRMatrix().generate(encodedData);
  self.postMessage(matrix);
};
