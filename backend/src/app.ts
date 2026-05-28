import express from 'express';
import cors from 'cors';
import logisticsRoutes from './routes/logistics.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use((_req, res, next) => {
    if (!res.getHeader('Content-Disposition')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
    }
    next();
});

app.use('/logistics', logisticsRoutes);

app.use(errorHandler);

export default app;