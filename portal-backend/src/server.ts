// src/server.ts
import express, { Application, Request, Response } from 'express';
import config from './config/config';

import todoRoutes from './routes/todoRoutes';
import { errorHandler } from './middlewares/errorMiddleware';

const app: Application = express();
const PORT = config.port;

app.use(express.json());

app.use('/api/todos', todoRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('API is up and running! 🚀');
});

// Error handling middleware should be the last loaded middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
