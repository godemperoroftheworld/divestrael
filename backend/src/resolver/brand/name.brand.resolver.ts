import { BrandQuery, BrandResolver } from '@/resolver/brand/brand.resolver.types';
import { Brand } from '@/schemas/zod';
import BrandService from '@/services/brand.service';
import { areNamesSimilar } from '@/utils';

const WITH_PRODUCTS = { include: ['products'] };

export default class NameBrandResolver extends BrandResolver {
  public override async resolve({ name }: BrandQuery): Promise<Brand | null> {
    if (!name) return null;

    const exact = await BrandService.instance.getOneByProperty('name', name, WITH_PRODUCTS);
    if (exact) return exact;

    const candidate = await BrandService.instance.searchOne(name, true, WITH_PRODUCTS, 0);
    if (candidate && areNamesSimilar(candidate.name, name)) {
      return candidate;
    }
    return null;
  }
}
