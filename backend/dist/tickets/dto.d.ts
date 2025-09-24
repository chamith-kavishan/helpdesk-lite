import { z } from 'zod';
export declare const CreateTicketDto: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    priority: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>>;
}, "strip", z.ZodTypeAny, {
    description: string;
    title: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
}, {
    description: string;
    title: string;
    priority?: "LOW" | "MEDIUM" | "HIGH" | undefined;
}>;
export type CreateTicketDto = z.infer<typeof CreateTicketDto>;
export declare const UpdateTicketDto: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["OPEN", "IN_PROGRESS", "RESOLVED"]>>;
    priority: z.ZodOptional<z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>>;
}, "strip", z.ZodTypeAny, {
    description?: string | undefined;
    status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | undefined;
    title?: string | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | undefined;
}, {
    description?: string | undefined;
    status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | undefined;
    title?: string | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | undefined;
}>;
export type UpdateTicketDto = z.infer<typeof UpdateTicketDto>;
export declare const AssignDto: z.ZodObject<{
    assigned_to: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    assigned_to: number;
}, {
    assigned_to: number;
}>;
export type AssignDto = z.infer<typeof AssignDto>;
