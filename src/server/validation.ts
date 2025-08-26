import { z } from "zod";

export const CreateKeySchema = z.object({ name: z.string().min(5).max(100)});
export const DeleteKeySchema = z.object({ keyId: z.string().uuid() });