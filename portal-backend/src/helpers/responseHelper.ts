import { Response } from 'express';
import { IApiResponse } from '../interfaces/IApiResponse';

export const sendSuccess = <T>(res: Response, message: string, data?: T, statusCode = 200): Response<IApiResponse<T>> => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const sendError = (res: Response, message: string, statusCode = 500): Response<IApiResponse> => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
