// cPanel / Phusion Passenger production entrypoint for Next.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const port = parseInt(process.env.PORT, 10) || 3000;
const hostname = "0.0.0.0";
const dev = false;

console.log(`[Next.js Server] Initializing on ${hostname}:${port} (Node ${process.version})...`);
console.log(`[Next.js Server] Current directory: ${process.cwd()}`);

process.on("uncaughtException", (err) => {
  console.error("[Next.js Server] Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("[Next.js Server] Unhandled Rejection:", reason);
  process.exit(1);
});

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    console.log("[Next.js Server] App prepared successfully. Binding HTTP listener...");
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });

    server.on("error", (err) => {
      console.error("[Next.js Server] Listener error:", err);
      process.exit(1);
    });

    server.listen(port, hostname, () => {
      console.log(`[Next.js Server] > Ready on http://${hostname}:${port}`);
    });
  })
  .catch((err) => {
    console.error("[Next.js Server] Fatal error during app.prepare():", err);
    process.exit(1);
  });

