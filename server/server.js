import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/DB.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { inngest, functions } from './inngest/index.js';
import ShowRouter from './routes/showRoute.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
// import { stripeWebhooks } from './controllers/stripeWebhooks.js';

const app = express();

const port = process.env.PORT

await connectDB();

// app.use(
//   '/api/stripe',
//   express.raw({
//     type: 'application/json',
//   }),
//   stripeWebhooks
// );

app.use(express.json());

const allowedOrigins = [
  'http://localhost:5173', // Vite dev server
  process.env.CLIENT_URL   // Your deployed frontend URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(clerkMiddleware());

app.get('/', (req, res) => res.send('Server is Live!'));
app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/show', ShowRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRoutes);

app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);

export default app; 