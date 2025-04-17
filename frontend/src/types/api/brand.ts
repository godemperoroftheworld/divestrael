import Product from '@/types/api/product';
import Company from '@/types/api/company';
import { Type } from 'class-transformer';

export default class Brand {
  id!: string;
  name!: string;
  companyId!: string;
  @Type(() => Company)
  company?: Company;
  @Type(() => Product)
  products?: Product[];
}
