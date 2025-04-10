import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './domains/routes';
import { setupSwagger } from './swagger';
import errorHandler from './middleware/errorHandler';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

dotenv.config();

const app = express();
app.use(morgan('dev'));
const allowedOrigins = process.env.CLIENT_URL?.split(',') || [];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    exposedHeaders: ['Authorization'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use('/test', (req, res, next) =>
  next({ statusCode: 401, message: 'test' })
);
app.use('/api', router);

setupSwagger(app);

app.use(errorHandler);

export default app;
function logger(arg0: string): any {
  throw new Error('Function not implemented.');
}
