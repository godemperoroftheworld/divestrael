import PrismaRoute from '@/routes/PrismaRoute';
import BarcodeController from '@/controllers/barcode.controller';
import { BarcodePartialWithRelationsSchema, BarcodeSchema } from '@/schemas/zod';

export default class BarcodeRoute extends PrismaRoute<'Barcode'> {
  public static readonly instance = new BarcodeRoute();

  private constructor() {
    super('barcode', BarcodeController.instance, BarcodeSchema, BarcodePartialWithRelationsSchema);
  }
}
