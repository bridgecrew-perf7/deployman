import dotenv from 'dotenv';
import { cleanEnv, str, num, bool, url } from 'envalid';

const result = dotenv.config();
if (result.error) {
  throw result.error;
}

export default cleanEnv(
  { ...result.parsed, ...process.env },
  {
    NODE_ENV: str({ choices: ['development', 'test', 'production', 'stag'] }),
    PORT: num({ default: 8080, devDefault: 8080 }),
    HTTP_ENABLE: bool({ default: true, devDefault: true }),
    WORKER_ENABLE: bool({ default: false, devDefault: false }),
    MONGO_URL: str({
      default: '',
      devDefault: '',
      example: 'mongodb://localhost:27017/example',
    }),
    RPC_URL: url({
      default: 'http://localhost:3456/rpc',
      devDefault: 'http://localhost:3456/rpc',
    }),
  },
);
