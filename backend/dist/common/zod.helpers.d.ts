import { ZodSchema } from 'zod';
export declare const ValidateZod: (schema: ZodSchema) => <TFunction extends Function, Y>(target: TFunction | object, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<Y>) => void;
