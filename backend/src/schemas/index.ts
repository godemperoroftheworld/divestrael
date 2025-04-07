import z from 'zod';

export const idParams = z.object({
  id: z.string().nonempty(),
});
export type IdParams = z.infer<typeof idParams>;

export const searchQuery = z.object({
  query: z.string().nonempty(),
});
export type SearchQuery = z.infer<typeof searchQuery>;
