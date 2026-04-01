import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  FRONTEND_URL: z.string().default("http://localhost:3000"),
  SUPABASE_URL: z.string().min(1, "SUPABASE_URL is required"),
  SUPABASE_ANON_KEY: z.string().min(1, "SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),
  RESEND_API_KEY: z.string().default(""),
  EMAIL_FROM: z.string().default("AutoDeals <noreply@yourdomain.com>"),
  WHATSAPP_NUMBER: z.string().default(""),
  BUSINESS_NAME: z.string().default("AutoDeals"),
});

export const env = envSchema.parse(process.env);
