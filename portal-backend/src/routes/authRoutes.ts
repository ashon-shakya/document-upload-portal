import { Router } from 'express';
import { signup, login, logout } from '../controllers/authController';
import { validateRequest } from '../middlewares/validateRequest';
import { signupSchema, loginSchema } from '../validators/authValidators';

const router = Router();

// POST /api/auth/signup
router.post('/signup', validateRequest(signupSchema), signup);

// POST /api/auth/login
router.post('/login', validateRequest(loginSchema), login);

// POST /api/auth/logout
router.post('/logout', logout);

export default router;
