import dotenv from 'dotenv';
dotenv.config();

function required(key){
    const value = process.env[key];
    if(!value){
        throw new Error(`Environment variable ${key} is required but not set.`);
    }
    return value;
}

function optional(key, defaultValue){
    return process.env[key] || defaultValue;
}

export const ENV = {
    PORT: optional('PORT', 5000),
    MONGODB_URI: required('MONGODB_URI'),
    JWT_SECRET: required('JWT_SECRET'),
    ML_SERVICE_URL: required('ML_SERVICE_URL')
};