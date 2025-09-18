import { z } from "zod";

export const CreateKeySchema = z.object({
  name: z.string().min(2).max(256),
  period: z.string().min(1).max(100),
  origin: z.string().min(1).max(100),
  value: z.number().min(1),
  imageUrl: z.string().url().optional(),
});

export const DeleteKeySchema = z.object({
  keyId: z.string().uuid(),
});
