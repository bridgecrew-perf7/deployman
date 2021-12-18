const handlers: { [key: string]: Function } = {
  now: Date.now,
  random: Math.random,
  echo: <T>(x: T) => x,
  add: (x: number, y: number) => x + y,
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

handlers['fetch'] = (url: string) =>
  fetch(url, { method: 'GET' }).then((r) => r.text());
handlers['sleep'] = sleep;
handlers['rollout'] = () => {
  const bin = Deno.env.get('KUBECTL_BIN') as string;

  return Deno.run({
    cmd: [bin, 'get', 'po'],
  });
};

export { handlers };
