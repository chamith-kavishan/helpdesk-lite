import { z } from 'zod';
export declare const RegisterDto: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    role: z.ZodDefault<z.ZodOptional<z.ZodEnum<["user", "admin"]>>>;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    role: "user" | "admin";
}, {
    password: string;
    email: string;
    role?: "user" | "admin" | undefined;
}>;
export type RegisterDto = z.infer<typeof RegisterDto>;
export declare const LoginDto: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
}, {
    password: string;
    email: string;
}>;
export type LoginDto = z.infer<typeof LoginDto>;
