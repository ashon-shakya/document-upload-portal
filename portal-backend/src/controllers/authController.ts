import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/userModel';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { sendSuccess, sendError } from '../helpers/responseHelper';

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validatedData = req.body;

        // Check if user already exists
        const userExists = await UserModel.findOne({
            $or: [{ email: validatedData.email }, { username: validatedData.username }]
        });

        if (userExists) {
            sendError(res, 'User with this email or username already exists', 400);
            return;
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(validatedData.password, salt);

        // Create new user in DB
        const newUser = await UserModel.create({
            fullName: validatedData.fullName,
            username: validatedData.username,
            email: validatedData.email,
            password: hashedPassword,
            profileImageUrl: validatedData.profileImageUrl
        });

        sendSuccess(res, 'User registered successfully', {
            id: newUser._id,
            fullName: newUser.fullName,
            username: newUser.username,
            email: newUser.email,
            profileImageUrl: newUser.profileImageUrl,
            createdAt: newUser.createdAt
        }, 201);

    } catch (error: any) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const validatedData = req.body;

        const user = await UserModel.findOne({
            $or: [{ email: validatedData.identifier }, { username: validatedData.identifier }]
        });


        if (!user || !user.password) {
            sendError(res, 'Invalid credentials', 401);
            return;
        }

        const isMatch = await bcrypt.compare(validatedData.password, user.password);

        if (!isMatch) {
            sendError(res, 'Invalid credentials', 401);
            return;
        }

        const expiresIn = validatedData.rememberMe ? '30d' : (config.jwtExpiresIn as any);
        const cookieMaxAge = validatedData.rememberMe
            ? 30 * 24 * 60 * 60 * 1000 // 30 days
            : 24 * 60 * 60 * 1000;      // 1 day (default)

        const token = jwt.sign(
            { email: user.email },
            config.jwtSecret,
            { expiresIn }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: config.nodeEnv === 'production',
            maxAge: cookieMaxAge
        });

        sendSuccess(res, 'Login successful');

    } catch (error: any) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        res.clearCookie('token');
        sendSuccess(res, 'Logged out successfully', null);
    } catch (error: any) {
        next(error);
    }
};

export const getUserProfile = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = req.user;

        if (!user) {
            sendError(res, 'User not found', 404);
            return;
        }

        sendSuccess(res, 'User details retrieved successfully', {
            id: user._id,
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            profileImageUrl: user.profileImageUrl,
            createdAt: user.createdAt
        });
    } catch (error: any) {
        next(error);
    }
};
