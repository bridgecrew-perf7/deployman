const handlers: { [key: string]: Function } = {
  now: Date.now,
  random: Math.random,
  echo: <T>(x: T) => x,
  add: (x: number, y: number) => x + y,
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function rollout() {
  const p = Deno.run({
    cmd: ['/usr/local/bin/kubectl', 'get', 'po'],
    stdout: 'piped',
    stderr: 'piped',
  });

  const { code } = await p.status();
  const rawOutput = await p.output();
  const rawError = await p.stderrOutput();

  return {
    code,
    output: new TextDecoder().decode(rawOutput),
    error: new TextDecoder().decode(rawError),
  };
}

handlers['fetch'] = (url: string) =>
  fetch(url, { method: 'GET' }).then((r) => r.text());
handlers['sleep'] = sleep;
handlers['rollout'] = rollout;

export { handlers };
