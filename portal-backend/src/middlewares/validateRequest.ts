import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { sendError } from '../helpers/responseHelper';

export const validateRequest = (schema: z.ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                const firstError = error.issues[0];
                sendError(res, `Validation failed: ${firstError.message}`, 400);
                return;
            }
            next(error);
        }
    };
};
