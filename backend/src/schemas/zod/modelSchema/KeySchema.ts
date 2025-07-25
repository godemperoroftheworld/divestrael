import { z } from 'zod';

/////////////////////////////////////////
// KEY SCHEMA
/////////////////////////////////////////

export const KeySchema = z.object({
  id: z.string(),
  key: z.string(),
});

export type Key = z.infer<typeof KeySchema>;

/////////////////////////////////////////
// KEY PARTIAL SCHEMA
/////////////////////////////////////////

export const KeyPartialSchema = KeySchema.partial();

export type KeyPartial = z.infer<typeof KeyPartialSchema>;

export default KeySchema;
