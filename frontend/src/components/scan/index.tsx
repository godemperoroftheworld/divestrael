import { BarcodeScanner } from 'react-barcode-scanner';
import 'react-barcode-scanner/polyfill';
import { useCallback, useRef } from 'react';

export default function Scan() {
  const barcode = useRef('');

  const onCapture = useCallback((barcodes: { rawValue: string }[]) => {
    console.log('capture: ' + barcodes[0].rawValue);
    barcode.current = barcodes[0].rawValue;
  }, []);

  return (
    <>
      {barcode.current}
      <BarcodeScanner
        onCapture={onCapture}
        options={{
          formats: [
            'codabar',
            'itf',
            'code_39',
            'code_93',
            'code_128',
            'ean_8',
            'ean_13',
            'upc_a',
            'upc_e',
          ],
          delay: 250,
        }}
      />
    </>
  );
}
