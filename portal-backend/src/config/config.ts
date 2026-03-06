import dotenv from 'dotenv';
import { AppConfig } from '../interfaces/AppConfig';

dotenv.config();

const config: AppConfig = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/user-portal',
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    swaggerServers: process.env.SWAGGER_SERVERS ? process.env.SWAGGER_SERVERS.split(',').map(url => url.trim()) : [],
    awsRegion: process.env.AWS_REGION || 'ap-southeast-2',
    awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    awsS3BucketName: process.env.AWS_S3_BUCKET_NAME || '',
    awsS3BucketFolder: process.env.AWS_S3_BUCKET_FOLDER || 'truuth',
    // Add other environment variables here as needed
};


export default config;
