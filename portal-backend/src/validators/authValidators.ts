import { z } from 'zod';

// Define the validation schema for sign up
export const signupSchema = z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    profileImageUrl: z.string().optional(),
});

// Define the validation schema for login
export const loginSchema = z.object({
    identifier: z.string().min(3, 'Username or email must be at least 3 characters'),
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional(),
});
