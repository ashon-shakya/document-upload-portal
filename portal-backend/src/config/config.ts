import dotenv from 'dotenv';
import { IAppConfig } from '../interfaces/IAppConfig';

dotenv.config();

const config: IAppConfig = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/user-portal',
    jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key_for_dev_only',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    swaggerServers: process.env.SWAGGER_SERVERS ? process.env.SWAGGER_SERVERS.split(',').map(url => url.trim()) : [],
    awsOptions: {
        region: process.env.AWS_REGION || 'ap-southeast-2',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        s3BucketName: process.env.AWS_S3_BUCKET_NAME || '',
        s3BucketFolder: process.env.AWS_S3_BUCKET_FOLDER || 'truuth',
    },
    truuthOptions: {
        tenantAlias: process.env.TRUUTH_TENNANT_ALIAS || '',
        apiKey: process.env.TRUUTH_API_KEY || '',
        apiSecret: process.env.TRUUTH_API_SECRET || '',
        apiUrls: {
            classify: process.env.TRUUTH_CLASSIFY_URL || '',
            submitFraud: process.env.TRUUTH_SUBMIT_FRAUD_CHECK_URL?.replace('{tenantAlias}', process.env.TRUUTH_TENNANT_ALIAS || '') || '',
            getFraud: process.env.TRUUTH_GET_FRAUD_CHECK_URL?.replace('{tenantAlias}', process.env.TRUUTH_TENNANT_ALIAS || '') || '',
        }
    }
    // Add other environment variables here as needed
};


export default config;
