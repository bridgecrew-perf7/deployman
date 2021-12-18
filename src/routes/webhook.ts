import { Context } from 'koa';
import Router from '@koa/router';
import { createHash } from 'crypto';
import fetch from 'node-fetch';
import { github } from '../middlewares';
import { github as secret } from '../key';
import config from '../config';

const router = new Router({
  prefix: '/webhook',
});

router.use(
  github({
    token: createHash('sha256').update(secret.value).digest('base64'),
  }),
);

router.post('/recommend', async (ctx: Context) => {
  // const body = ctx.request.body || {};
  try {
    const result = await fetch(config.RPC_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        [secret.name]: ctx.header[secret.name],
      },
      body: JSON.stringify({
        id: Math.random().toString('32').substr(2),
        method: 'echo',
        params: ['hello world 🤪'],
      }),
    }).then((r) => r.json());

    console.log(result);

    ctx.body = result;
  } catch (err) {
    ctx.throw(err);
  }
});

export default router;
