import { Context, Next, Middleware } from 'koa';
import { genToken } from '../utils/hash';

type TokenMiddlewareOptions = { name?: string; value?: string };

const DEFAULT_OPTIONS = { name: '', value: '' };

export default function token({
  name,
  value,
}: TokenMiddlewareOptions = DEFAULT_OPTIONS): Middleware {
  let token = '';
  if (name && value) {
    token = genToken(name as string, value as string);
  }

  return async (ctx: Context, next: Next): Promise<any> => {
    if (ctx.header[name as string] === token) {
      await next();
    } else {
      ctx.throw(500, 'Invalid secret key');
    }
  };
}
