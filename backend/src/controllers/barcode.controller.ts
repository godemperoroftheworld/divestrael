import { BarcodeResponse } from '@/schemas/barcode.schema';
import BarcodeService, { BarcodeWithData } from '@/services/barcode.service';
import barcodeMapper from '@/controllers/mappers/barcode.mapper';
import PrismaController from '@/controllers/PrismaController';

export default class BarcodeController extends PrismaController<
  'Barcode',
  BarcodeResponse,
  BarcodeWithData
> {
  public static readonly instance = new BarcodeController();

  private constructor() {
    super(BarcodeService.instance);
  }

  protected mapData(data: BarcodeWithData): BarcodeResponse {
    return barcodeMapper(data);
  }
}
