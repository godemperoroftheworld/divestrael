import Country from '@/types/api/country';
import BoycottReason, { BoycottMapping } from '@/types/api/reason';
import Brand from '@/types/api/brand';
import { Transform, Type } from 'class-transformer';

export default class Company {
  public id!: string;
  public name!: string;
  public description!: string;
  public country!: Country;
  @Transform(
    ({ value }) =>
      value.map((v: string) => BoycottReason[v as keyof typeof BoycottReason]),
    { toClassOnly: true },
  )
  @Transform(({ value }) => value.map((v: BoycottReason) => v), {
    toPlainOnly: true,
  })
  public reasons!: BoycottReason[];
  public cik!: number | null;
  public cw_id!: number | null;
  public source!: string | null;
  public url!: string | null;
  @Type(() => Brand)
  public brands?: Brand[];

  public get boycotted(): boolean {
    return this.reasons.length > 0;
  }

  public get reasonsFormatted() {
    return this.reasons.map((r) => BoycottMapping[r]);
  }

  public get image_url() {
    const urlNoHttp =
      this.url
        ?.replace('http://', '')
        .replace('https://', '')
        .replace(/\/.*/, '') ?? '';
    return `/image/${urlNoHttp}`;
  }
}
