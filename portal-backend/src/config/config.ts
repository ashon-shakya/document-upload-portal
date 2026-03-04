import dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT || 3000,
    // Add other environment variables here as needed
};

export default config;
