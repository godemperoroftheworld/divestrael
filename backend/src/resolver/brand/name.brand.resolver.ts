import { BrandQuery, BrandResolver } from '@/resolver/brand/brand.resolver.types';
import { Brand } from '@/schemas/zod';
import BrandService from '@/services/brand.service';

export default class NameBrandResolver extends BrandResolver {
  public override async resolve({ name }: BrandQuery): Promise<Brand | null> {
    if (name) {
      return await BrandService.instance.searchOne(name, true, { include: ['products'] });
    }
    return null;
  }
}
