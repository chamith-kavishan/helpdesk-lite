"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginDto = exports.RegisterDto = void 0;
const zod_1 = require("zod");
exports.RegisterDto = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    role: zod_1.z.enum(['user', 'admin']).optional().default('user'),
});
exports.LoginDto = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().nonempty(),
});
//# sourceMappingURL=dto.js.map