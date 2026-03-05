// src/server.ts
import express, { Application, Request, Response } from 'express';
import config from './config/config';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middlewares/errorMiddleware';
import { connectDB } from './config/db';
import { loggerMiddleware } from './middlewares/loggerMiddleware';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';

// Load Swagger JSON
const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'swagger.json'), 'utf8'));

// Inject Dynamic Swagger Servers if available in environment
if (config.swaggerServers && config.swaggerServers.length > 0) {
    swaggerDocument.servers = config.swaggerServers.map((url: string) => ({
        url,
        description: 'Dynamic environment server'
    }));
}

const app: Application = express();
const PORT = config.port;

app.use(cors({
    origin: config.frontendUrl,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// API Logger
app.use(loggerMiddleware);

app.use('/api/auth', authRoutes);

const swaggerOptions = {
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css',
    customJs: [
        'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js',
        'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js'
    ],
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

app.get('/', (req: Request, res: Response) => {
    res.send('API is up and running! 🚀');
});

// Error handling middleware should be the last loaded middleware
app.use(errorHandler);

// Make sure DB connects during cold start in lambda or when express starts
connectDB();

if (config.nodeEnv !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;
