export interface AppConfig {
    port: string | number;
    mongoUri: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    nodeEnv: string;
    frontendUrl: string;
    swaggerServers: string[];
}
