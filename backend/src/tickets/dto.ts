import { z } from 'zod';

export const CreateTicketDto = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('LOW'),
});
export type CreateTicketDto = z.infer<typeof CreateTicketDto>;

export const UpdateTicketDto = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(3).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});
export type UpdateTicketDto = z.infer<typeof UpdateTicketDto>;

export const AssignDto = z.object({
  assigned_to: z.number().int().positive(),
});
export type AssignDto = z.infer<typeof AssignDto>;
