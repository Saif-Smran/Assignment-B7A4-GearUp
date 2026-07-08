import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export const config = {
    port: process.env.PORT,
    databaseUrl: process.env.DATABASE_URL,
    appurl: process.env.APP_URL,
    bcypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS ? parseInt(process.env.BCRYPT_SALT_ROUNDS) : 10,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,
    stripe_secret_key: process.env.STRIPE_SECRET_KEY!,
    stripe_public_key: process.env.STRIPE_PUBLIC_KEY!,
    stripe_webhook_secret: process.env.STRIPE_WEBHOOK_SECRET!,
    app_url: process.env.APP_URL!,
};
