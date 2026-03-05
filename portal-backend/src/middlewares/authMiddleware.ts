import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { sendError } from '../helpers/responseHelper';
import { UserModel } from '../models/userModel';
import { AuthRequest } from '../interfaces/AuthRequest';

export const protectRoute = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.cookies.token;

        if (!token) {
            sendError(res, 'Not authorized, no token provided', 401);
            return;
        }

        const decoded: any = jwt.verify(token, config.jwtSecret);

        req.user = await UserModel.findOne({ email: decoded.email }).select('-password');

        if (!req.user) {
            sendError(res, 'Not authorized, user not found', 401);
            return;
        }

        next();
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            sendError(res, 'Not authorized, token expired', 401);
            return;
        }
        sendError(res, 'Not authorized, token failed', 401);
    }
};
