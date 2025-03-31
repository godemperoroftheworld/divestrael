import axios, { AxiosInstance } from 'axios';

interface BarcodeApiResult {
  title: string;
  alias: string;
  brand: string;
  manufacturer: string;
  barcode: '0111222333446';
}

// Service to get barcode information
export default class BarcodeService {
  private static _instance: BarcodeService;

  private axiosInstance: AxiosInstance;

  public static get instance() {
    if (!BarcodeService._instance) {
      BarcodeService._instance = new BarcodeService();
    }
    return BarcodeService._instance;
  }

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.upcdatabase.org/',
    });
    this.axiosInstance.interceptors.request.use((config) => {
      // Add Authorization Header
      config.headers.authorization = `Bearer ${process.env.BARCODE_API_KEY}`;
      return config;
    });
  }

  public async getBarcode(barcode: string) {
    const result = await this.axiosInstance.get<BarcodeApiResult>(`product/${barcode}`);
    return result.data;
  }
}
