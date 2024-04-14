import dotenv from 'dotenv';

function loadEnv(): void {
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
}

export default loadEnv;