interface ENVConfig {
    ENV: 'development_frontend' | 'production';
    API_BASE: string;
}

export const ENV_VARS: ENVConfig = {
    ENV: 'development_frontend',
    API_BASE: './API_MOCKS',
};
