import { Prisma } from '@prisma/client';
import { GetFindResult } from '@prisma/client/runtime/client';

// Base types
export type PrismaModelName = keyof Prisma.TypeMap['model'];
export type PrismaModelProperty = Prisma.TypeMap['meta']['modelProps'];
export type PrismaModel<T extends PrismaModelName> = GetFindResult<
  Prisma.TypeMap['model'][T]['payload'],
  object,
  object
>;
