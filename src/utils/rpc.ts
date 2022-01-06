import fetch from 'node-fetch';
import config from '../config';
import { rpc as secret } from '../key';
import { genToken } from './hash';

const token = genToken(secret.name, secret.value);

const headers = {
  'content-type': 'application/json',
  [secret.name]: token,
};

export default async function rpcCall(method: string, ...params: any[]) {
  const requestId = Math.random().toString(32).slice(2);
  // 保存发起请求内容

  const response = await fetch(config.RPC_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      id: requestId,
      method,
      params,
    }),
  });

  if (!response.ok) {
    return {};
  }

  const { id, data } = await response.json();
  // 保存当前请求的响应

  return { id };
}
