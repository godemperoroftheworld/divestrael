import { Prisma } from '@prisma/client';
import { GetResult } from '@prisma/client/runtime/library';

// Base types
export type PrismaModelName =
  Prisma.TypeMap['model'][keyof Prisma.TypeMap['model']]['payload']['name'];
type PrismaPayload<T extends PrismaModelName> = Prisma.TypeMap['model'][T]['payload'];
type PrismaObjects<T extends PrismaModelName> = PrismaPayload<T>['objects'];
type PrismaSelectAll<T extends PrismaModelName> = {
  [K in keyof PrismaObjects<T>]: PrismaObjects<T>[K] extends {
    name: infer N extends PrismaModelName;
  }
    ? PrismaSelectAll<N>
    : true;
};

export type PrismaModel<T extends PrismaModelName> = GetResult<PrismaPayload<T>, object>;
export type PrismaModelExpanded<T extends PrismaModelName> =
  Prisma.TypeMap['model'][T]['payload']['scalars'] &
    Partial<
      GetResult<
        PrismaPayload<T>,
        {
          include: PrismaSelectAll<T>;
        }
      >
    >;
