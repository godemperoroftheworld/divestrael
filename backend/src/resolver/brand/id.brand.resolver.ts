import { BrandQuery, BrandResolver } from '@/resolver/brand/brand.resolver.types';
import { Brand } from '@/schemas/zod';
import BrandService from '@/services/brand.service';

export default class IdBrandResolver extends BrandResolver {
  public override async resolve({ id }: BrandQuery): Promise<Brand | null> {
    if (id) {
      return await BrandService.instance.getOne(id);
    }
    return null;
  }
}
