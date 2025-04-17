import Country from '@/types/api/country';
import BoycottReason from '@/types/api/reason';
import Brand from '@/types/api/brand';
import { Type } from 'class-transformer';

export default class Company {
  public id!: string;
  public name!: string;
  public description!: string;
  public country!: Country;
  public reasons!: BoycottReason[];
  public cik!: number | null;
  public cw_id!: number | null;
  public image!: string | null;
  public source!: string | null;
  @Type(() => Brand)
  public brands?: Brand[];

  public get boycotted(): boolean {
    return this.reasons.length > 0;
  }
}
