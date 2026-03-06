export interface AppConfig {
    port: string | number;
    mongoUri: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    nodeEnv: string;
    frontendUrl: string;
    swaggerServers: string[];
    awsRegion: string;
    awsAccessKeyId: string;
    awsSecretAccessKey: string;
    awsS3BucketName: string;
    awsS3BucketFolder: string;
}
