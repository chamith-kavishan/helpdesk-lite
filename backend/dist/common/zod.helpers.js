"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateZod = void 0;
const common_1 = require("@nestjs/common");
const zod_pipe_1 = require("./zod.pipe");
const ValidateZod = (schema) => (0, common_1.applyDecorators)((0, common_1.UsePipes)(new zod_pipe_1.ZodValidationPipe(schema)));
exports.ValidateZod = ValidateZod;
//# sourceMappingURL=zod.helpers.js.map