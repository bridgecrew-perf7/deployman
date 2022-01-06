import { BinaryToTextEncoding, createHash } from 'crypto';

export function genToken(name: string, value: string) {
  const token = sha256(value, 'base64');
  console.log(`[${name}] Generated token of:`, token);
  return token;
}

export function sha256(value: string, encoding: BinaryToTextEncoding = 'hex') {
  const token = createHash('sha256').update(value).digest(encoding);
  return token;
}

export function md5(value: string, encoding: BinaryToTextEncoding = 'hex') {
  return createHash('md5').update(value).digest(encoding);
}
