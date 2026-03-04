import { Router } from 'express';
import { signup } from '../controllers/authController';

const router = Router();

// POST /api/auth/signup
router.post('/signup', signup);

export default router;
