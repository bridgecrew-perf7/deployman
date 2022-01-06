import { Context, Next } from 'koa';
import Router from '@koa/router';
import { aliyun } from '../key';
import { genToken } from '../utils/hash';
import { inputAliyunSchema, VersionSchema } from '../schemas';

const router = new Router({
  prefix: '/webhook',
});

const secretKey = genToken(aliyun.name, aliyun.value);

router.use('/aliyun/:key', async (ctx: Context, next: Next) => {
  const { key } = ctx.params;
  if (key === secretKey) {
    await next();
  } else {
    ctx.throw(500, 'Invalid secret key');
  }
});

router.post('/aliyun/:key', async (ctx: Context) => {
  const body = ctx.request.body;
  console.log('[webhook] Received:', body);

  inputAliyunSchema.validate(body);

  /*
{
  push_data: {
    digest: 'sha256:cece06ba3056363db1b4751cd2f1c44f7b1881d789da62fc2bcd2282ab5ab883',
    pushed_at: '2022-01-06 19:10:17',
    tag: 'v1.1.1-beta1-a5ff2939'
  },
  repository: {
    date_created: '2022-01-06 15:10:28',
    name: 'recommend',
    namespace: 'paiya',
    region: 'cn-qingdao',
    repo_authentication_type: 'NO_CERTIFIED',
    repo_full_name: 'paiya/recommend',
    repo_origin_type: 'NO_CERTIFIED',
    repo_type: 'PRIVATE'
  }
}
  */

  const Versions = ctx.collection('deploy_versions');

  const data = {
    version: body.push_data.tag,
    pushedAt: new Date(body.push_data.tag),
    createdAt: new Date(),
    isDeleted: false,
  };
  VersionSchema.validate(data);
  await Versions.insertOne(data);

  ctx.success(body);
});

export default router;
