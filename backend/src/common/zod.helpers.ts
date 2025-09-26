import { applyDecorators, UsePipes } from '@nestjs/common';
import { ZodSchema } from 'zod';

import { ZodValidationPipe } from './zod.pipe';

export const ValidateZod = (schema: ZodSchema) =>
  applyDecorators(UsePipes(new ZodValidationPipe(schema)));
