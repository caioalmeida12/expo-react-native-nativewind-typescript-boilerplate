import { z } from "zod";

export const TLoginResponse = z.object({
  access_token: z.string(),
  token_type: z.literal("bearer"),
  id: z.number().int(),
  classfication: z.literal("STUDENT"),
  campus: z.literal(1),
  active: z.union([z.literal(1), z.literal(0)]),
  expires_in: z.number().int(),
});

export const TStudentInfoResponse = z.object({
  id: z.number(),
  name: z.string(),
  mat: z.string(),
  course_id: z.number(),
  shift_id: z.number().nullable(),
  campus_id: z.number(),
  photo: z.string().nullable(),
  observation: z.string().nullable(),
  republic: z.boolean().nullable(),
  block: z.boolean().nullable(),
  active: z.number().transform(Boolean),
  dateValid: z.string(),
  semRegular: z.number(),
  hasKey: z.number().transform(Boolean),
  cabinet: z.number().min(1).max(44).nullable().default(null),
  key: z.number().min(1).max(12).nullable().default(null),
  course: z.object({
    id: z.number(),
    description: z.string(),
    initials: z.string(),
    campus_id: z.number(),
  }),
});

export type TStudentInfoResponse = z.infer<typeof TStudentInfoResponse>;
export type TLoginResponse = z.infer<typeof TLoginResponse>;
