import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './domains/routes';
import { setupSwagger } from './swagger.ts';
import errorHandler from './middleware/errorHandler.ts';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/test', (req, res, next) => next({statusCode: 401, message: "test"}));
app.use('/api', router);

setupSwagger(app);

app.use(errorHandler);

export default app;
