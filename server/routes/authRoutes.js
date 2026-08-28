import express from 'express';
import { getMe, login, register } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/me', protect, getMe);

export default authRouter;
