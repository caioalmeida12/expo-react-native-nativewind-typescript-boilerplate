import { z } from "zod";

const TLoginResponse = z.object({
    access_token: z.string(),
    token_type: z.literal("bearer"),
    id: z.number().int(),
    classification: z.literal("STUDENT"),
    campus: z.literal("1"),
    active: z.union([z.literal(1), z.literal(0)]),
    expires_in: z.number().int()
});

const TAuthenticationResponse = z.object({
    login: TLoginResponse
});

export type TAuthenticationResponse = z.infer<typeof TAuthenticationResponse>;