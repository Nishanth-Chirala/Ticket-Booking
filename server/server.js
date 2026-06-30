import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/DB.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { inngest, functions } from './inngest/index.js';
import ShowRouter from './routes/ShowRoute.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
// import { stripeWebhooks } from './controllers/stripeWebhooks.js';

const app = express();

// Connect Database
await connectDB();

// Stripe Webhook (Enable if needed)
// app.use(
//   '/api/stripe',
//   express.raw({ type: 'application/json' }),
//   stripeWebhooks
// );

// Middlewares
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Routes
app.get('/', (req, res) => {
  res.send('Server is Live!');
});

app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/show', ShowRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRoutes);

// Export app for Vercel
export default app;