export interface IAwsOptions {
    region: string;
    accessKeyId: string,
    secretAccessKey: string,
    s3BucketName: string,
    s3BucketFolder: string,
}

export interface ITruuthOptions {
    tenantAlias: string;
    apiKey: string;
    apiSecret: string;
    apiUrls: {
        classify: string;
        verify: string;
    }
}

export interface IAppConfig {
    port: string | number;
    mongoUri: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    nodeEnv: string;
    frontendUrl: string;
    swaggerServers: string[];
    awsOptions: IAwsOptions;
    truuthOptions: ITruuthOptions;
}
