let timer: NodeJS.Timeout | null = null;

try {
  !__isDev__ && bootstrap();
} catch (err) {
  console.error(err);
  timer && clearInterval(timer);
}

async function bootstrap() {
  timer = setInterval(() => {
    requestManifest().then((res: any) => {
      postMessage({
        type: "message",
        data: res,
      });
    });
  }, 5000);
}

self.addEventListener("message", () => {
  timer && clearInterval(timer);
});

function requestManifest() {
  return fetch(`/manifest.json?_t=${Date.now()}`)
    .then(res => res.json())
    .then(l => {
      return l;
    })
    .catch(() => {
      timer && clearInterval(timer);
    });
}
