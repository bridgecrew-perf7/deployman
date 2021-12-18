import { Db, Collection, Document } from 'mongodb';
import Koa from 'koa';
import type { EventBasedChannel } from 'async-call-rpc';

export interface BaseContext extends Record<T> {
  [key: string | number]: any;
  [index: number]: any;
}

export type HttpMethod = 'all' | 'get' | 'post' | 'put' | 'del';

/**
 * WebSocket support for AsyncCall.
 * Please make sure your serializer can convert JSON RPC payload into one of the following data types:
 *
 * - string
 * - ArrayBuffer
 * - SharedArrayBuffer
 * - Blob
 * - ArrayBufferView
 */
export class WebSocketMessageChannel
  extends WebSocket
  implements EventBasedChannel
{
  on(listener: (data: unknown) => void) {
    const f = (e: MessageEvent) => listener(e.data);
    this.addEventListener('message', f);
    return () => this.removeEventListener('message', f);
  }
  send(data: any): void {
    if (this.readyState === this.CONNECTING) {
      this.addEventListener('open', () => this.send(data), { once: true });
    } else super.send(data);
  }
}
