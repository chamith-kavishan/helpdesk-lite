"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignDto = exports.UpdateTicketDto = exports.CreateTicketDto = void 0;
const zod_1 = require("zod");
exports.CreateTicketDto = zod_1.z.object({
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().min(3),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']).default('LOW'),
});
exports.UpdateTicketDto = zod_1.z.object({
    title: zod_1.z.string().min(3).optional(),
    description: zod_1.z.string().min(3).optional(),
    status: zod_1.z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED']).optional(),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});
exports.AssignDto = zod_1.z.object({
    assigned_to: zod_1.z.number().int().positive(),
});
//# sourceMappingURL=dto.js.map