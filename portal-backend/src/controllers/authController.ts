import { Request, Response } from 'express';
import { z } from 'zod';
import { UserModel } from '../models/userModel';
import bcrypt from 'bcryptjs';

// Define the validation schema for sign up
const signupSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validate request body
        const validatedData = signupSchema.parse(req.body);

        // Check if user already exists
        const userExists = await UserModel.findOne({
            $or: [{ email: validatedData.email }, { username: validatedData.username }]
        });

        if (userExists) {
            res.status(400).json({ error: 'User with this email or username already exists' });
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
            password: hashedPassword
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                username: newUser.username,
                email: newUser.email,
                createdAt: newUser.createdAt
            }
        });

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            const errors = (error as any).errors.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message
            }));
            res.status(400).json({ error: 'Validation failed', details: errors });
            return;
        }
        res.status(500).json({ error: 'Server error during registration' });
    }
};
