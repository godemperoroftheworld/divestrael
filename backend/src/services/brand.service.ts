import { Brand } from '.prisma/client';

import PrismaService from '@/services/PrismaService';

export default class BrandService extends PrismaService<'Brand'> {
  public static readonly instance = new BrandService();

  protected override searchPath(): keyof Brand {
    return 'name';
  }

  private constructor() {
    super('brand');
  }
}
