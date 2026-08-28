import express from 'express';
import {
  createBooking,
  getOccupiedSeats,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const bookingRouter = express.Router();

bookingRouter.post('/create', protect, createBooking);
bookingRouter.get('/seats/:showId', getOccupiedSeats);

export default bookingRouter;
