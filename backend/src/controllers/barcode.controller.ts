import BarcodeService from '@/services/barcode.service';
import PrismaController from '@/controllers/PrismaController';

export default class BarcodeController extends PrismaController<'Barcode'> {
  public static readonly instance = new BarcodeController();

  private constructor() {
    super(BarcodeService.instance);
  }
}
