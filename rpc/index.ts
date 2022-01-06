import {
  Application,
  Context,
  Router,
  Logger,
  oakCors,
  createHash,
} from './deps.ts';
import { handlers } from './handlers.ts';
import { rpc as secret } from '../src/key.ts';

const app = new Application();

app.use(oakCors());
app.use(Logger.logger);
app.use(Logger.responseTime);

const router = new Router();

const tokenMiddleware = () => {
  const token = createHash('sha256').update(secret.value).toString('base64');
  return async (ctx: Context, next: any) => {
    if (ctx.request.headers.get(secret.name) === token) {
      await next();
    } else {
      ctx.throw(500);
    }
  };
};
router.use(tokenMiddleware());

router.post('/rpc', async (ctx: Context) => {
  const body = ctx.request.body();
  let responseBody: any;
  if (body.type === 'json') {
    let value;
    try {
      value = await body.value;
    } catch {}

    const id = value?.id;
    const method = value?.method;
    if (!(method in handlers)) {
      const message = `Method not found`;
      responseBody = { error: { message, code: -32601 }, jsonrpc: '2.0', id };
    } else {
      try {
        const fn = handlers[method];
        const params = value?.params ? value.params : [];
        console.log(`rpc await ${method}(${params ? params.join(',') : ''})`);
        const result = await fn(...params);
        responseBody = { result, jsonrpc: '2.0', id };
      } catch (e) {
        responseBody = {
          error: { message: `${e}`, code: -32603 },
          jsonrpc: '2.0',
          id,
        };
      }
    }
  } else {
    responseBody = {
      error: { message: 'Parse error', code: -32700 },
      jsonrpc: '2.0',
    };
  }
  ctx.response.body = responseBody;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', ({ secure, hostname, port }) => {
  console.log(
    `Listening on ${secure ? 'https' : 'http'}://${hostname}:${port}`,
  );
});

await app.listen({ hostname: '127.0.0.1', port: 3456 });
