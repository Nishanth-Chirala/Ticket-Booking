import express from 'express';
import {
  getFavorite,
  getUserBookings,
  updatFavorite,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const userRoutes = express.Router();

userRoutes.get('/bookings', protect, getUserBookings);
userRoutes.post('/update-favorites', protect, updatFavorite);
userRoutes.get('/favorites', protect, getFavorite);

export default userRoutes;
