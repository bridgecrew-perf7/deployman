import logger from 'koa-logger';
import responseTime from 'koa-response-time';
import body from 'koa-body';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import cors from '@koa/cors';
import json from 'koa-json';
import cacheContrl from 'koa-ctx-cache-control';
import github from './github';

export {
  logger,
  responseTime,
  body,
  conditional,
  etag,
  cors,
  json,
  cacheContrl,
  github,
};

export default [
  logger(),
  responseTime({
    hrtime: true,
  }),
  body({
    jsonLimit: '10mb',
    formLimit: '100kb',
    textLimit: '100kb',
  }),
  conditional(),
  etag(),
  cors(),
  json({ pretty: false, param: 'x-json-pretty' }),
];
