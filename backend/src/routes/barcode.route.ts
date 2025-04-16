import { barcodeBody, barcodeResponse } from '@/schemas/barcode.schema';
import PrismaRoute from '@/routes/PrismaRoute';
import { BarcodeWithData } from '@/services/barcode.service';
import BarcodeController from '@/controllers/barcode.controller';

export default class BarcodeRoute extends PrismaRoute<'Barcode', BarcodeWithData> {
  public static readonly instance = new BarcodeRoute();

  private constructor() {
    super('barcode', BarcodeController.instance, barcodeBody, barcodeResponse);
  }
}
