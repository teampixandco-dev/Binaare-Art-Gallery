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

    // Low-memory socket keepalive optimization
    server.keepAliveTimeout = 5000;
    server.headersTimeout = 6000;

    server.on("error", (err) => {
      console.error("[Next.js Server] Listener error:", err);
      process.exit(1);
    });

    server.listen(port, hostname, () => {
      console.log(`[Next.js Server] > Ready on http://${hostname}:${port}`);
    });

    // Graceful shutdown handling for PM2 restarts
    const gracefulShutdown = (signal) => {
      console.log(`[Next.js Server] Received ${signal}. Closing HTTP listener cleanly...`);
      server.close(() => {
        console.log("[Next.js Server] Server stopped cleanly. Port released.");
        process.exit(0);
      });
      setTimeout(() => {
        console.warn("[Next.js Server] Shutdown timed out. Forcing exit.");
        process.exit(0);
      }, 4000).unref();
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Runtime memory safety cleanup for long-running Node.js processes
    if (typeof global.gc === "function") {
      setInterval(() => {
        try {
          const mem = process.memoryUsage();
          if (mem.heapUsed > 200 * 1024 * 1024) {
            global.gc();
          }
        } catch (_) {}
      }, 30000);
    }
  })
  .catch((err) => {
    console.error("[Next.js Server] Fatal error during app.prepare():", err);
    process.exit(1);
  });

