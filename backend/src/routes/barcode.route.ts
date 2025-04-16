import { barcodeBody, barcodeResponse } from '@/schemas/barcode.schema';
import PrismaRoute from '@/routes/PrismaRoute';
import BarcodeController from '@/controllers/barcode.controller';

export default class BarcodeRoute extends PrismaRoute<'Barcode'> {
  public static readonly instance = new BarcodeRoute();

  private constructor() {
    super('barcode', BarcodeController.instance, barcodeBody, barcodeResponse);
  }
}
