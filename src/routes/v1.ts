import { Context } from 'koa';
import Router from '@koa/router';

const v1 = new Router({
  prefix: '/api/v1',
});

v1.get('/top/po', async (ctx: Context) => {
  ctx.body = {};
});

v1.get('/top/no', async (ctx: Context) => {
  ctx.body = {};
});

v1.get('/po', async (ctx: Context) => {
  ctx.body = {};
});

v1.get('/po/:id', async (ctx: Context) => {
  ctx.body = {};
});

v1.get('/svc', async (ctx: Context) => {
  ctx.body = {};
});

v1.get('/svc/:id', async (ctx: Context) => {
  ctx.body = {};
});

export default v1;
