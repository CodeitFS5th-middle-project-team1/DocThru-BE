import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './domains/routes';
import { setupSwagger } from './swagger';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/test', (req, res) => res.send({ message: 'hi' }));
app.use('/api', router);

setupSwagger(app);

export default app;
