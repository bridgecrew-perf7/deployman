import { Context, Next, Middleware } from 'koa';
import { github as secret } from '../key';

type GithubOptions = { token: string };

const DEFAULT_OPTIONS = { token: '' };

export default function github({
  token,
}: GithubOptions = DEFAULT_OPTIONS): Middleware {
  console.log('Generated token of:', token);
  return async (ctx: Context, next: Next): Promise<any> => {
    if (ctx.header[secret.name] === token) {
      await next();
    } else {
      ctx.throw(500);
    }
  };
}
