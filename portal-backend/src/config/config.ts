import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/user-portal',
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    swaggerServers: process.env.SWAGGER_SERVERS ? process.env.SWAGGER_SERVERS.split(',').map(url => url.trim()) : [],
    // Add other environment variables here as needed
};

export default config;
