import { Response } from 'express';
import { ApiResponse } from '../interfaces/ApiResponse';

export const sendSuccess = <T>(res: Response, message: string, data?: T, statusCode = 200): Response<ApiResponse<T>> => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const sendError = (res: Response, message: string, statusCode = 500): Response<ApiResponse> => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
