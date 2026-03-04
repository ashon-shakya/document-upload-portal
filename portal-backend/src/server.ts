// src/server.ts
import express, { Application, Request, Response } from 'express';
import config from './config/config';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/errorMiddleware';
import { connectDB } from './config/db';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import serverless from 'serverless-http';

// Load Swagger JSON
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'));

const app: Application = express();
const PORT = config.port;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req: Request, res: Response) => {
    res.send('API is up and running! 🚀');
});

// Error handling middleware should be the last loaded middleware
app.use(errorHandler);

// Make sure DB connects during cold start in lambda or when express starts
connectDB();

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export const handler = serverless(app);
