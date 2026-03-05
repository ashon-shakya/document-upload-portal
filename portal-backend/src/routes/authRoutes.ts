import { Router } from 'express';
import { signup, login, logout, getUserProfile } from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';
import { signupSchema, loginSchema } from '../validators/authValidators';
import { protectRoute } from '../middlewares/authMiddleware';

const router = Router();

// POST /api/auth/signup
router.post('/signup', validateRequest(signupSchema), signup);

// POST /api/auth/login
router.post('/login', validateRequest(loginSchema), login);

// POST /api/auth/logout
router.post('/logout', logout);

// GET /api/auth/profile
router.get('/profile', protectRoute, getUserProfile);

export default router;
