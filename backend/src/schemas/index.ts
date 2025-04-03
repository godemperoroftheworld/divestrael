import z from 'zod';

export const getParams = z.object({
  id: z.string().nonempty(),
});
export type GetParams = z.infer<typeof getParams>;

export const searchQuery = z.object({
  query: z.string().nonempty(),
});
export type SearchQuery = z.infer<typeof searchQuery>;
