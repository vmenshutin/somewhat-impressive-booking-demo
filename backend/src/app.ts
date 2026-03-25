import express, { Application } from 'express';
import cors from 'cors';
import staysRouter from './routes/stays';
import bookingsRouter from './routes/bookings';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stays', staysRouter);
app.use('/api/bookings', bookingsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
