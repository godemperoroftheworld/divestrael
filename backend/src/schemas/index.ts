import z from 'zod';

export const idParams = z.object({
  id: z.string().nonempty(),
});
export type IdParams = z.infer<typeof idParams>;

export const searchQuery = z.object({
  query: z.string().nonempty(),
});
export type SearchQuery = z.infer<typeof searchQuery>;

export const prismaBody = z.object({
  select: z.array(z.string().nonempty()).optional(),
  filter: z.object({}).optional(),
  include: z.object({}).optional(),
  omit: z.object({}).optional(),
});
export type PrismaBody = z.infer<typeof prismaBody>;
