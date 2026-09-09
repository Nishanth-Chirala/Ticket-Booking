import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/DB.js';
import { serve } from 'inngest/express';
import { inngest, functions } from './inngest/index.js';
import ShowRouter from './routes/showRoute.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import movieRouter from './routes/movieRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import authRouter from './routes/authRoutes.js';
import adminRequestRouter from './routes/adminRequestRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

const app = express();

const port = process.env.PORT || 3000;

await connectDB();

app.use(
  '/api/stripe',
  express.raw({
    type: 'application/json',
  }),
  stripeWebhooks
);

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Server is Live!'));
app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/auth', authRouter);
app.use('/api/admin-requests', adminRequestRouter);
app.use('/api/show', ShowRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/admin', adminRouter);
app.use('/api/user', userRoutes);
app.use('/api/movies', movieRouter);
app.use('/api/upload', uploadRouter);

app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);
