const http = require("http");
const net = require("net");
const { spawn } = require("child_process");

const DEFAULT_PORT = 5000;
const HEALTH_PATH = "/api/health";
const desiredPort = Number(process.env.PORT || DEFAULT_PORT);

const keepAlive = () => {
  console.log(`[dev] Reusing existing Populens API on port ${desiredPort}.`);

  const intervalId = setInterval(() => {}, 60_000);

  const stop = () => {
    clearInterval(intervalId);
    process.exit(0);
  };

  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
};

const startServer = () => {
  const child = spawn("npm", ["run", "dev", "--prefix", "server"], {
    stdio: "inherit",
    shell: true,
    env: process.env
  });

  child.on("exit", (code) => {
    process.exit(code ?? 0);
  });
};

const verifyExistingServer = () =>
  new Promise((resolve) => {
    const request = http.get(
      {
        host: "127.0.0.1",
        port: desiredPort,
        path: HEALTH_PATH,
        timeout: 1500
      },
      (response) => {
        let body = "";

        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          const isHealthy = response.statusCode === 200 && body.includes('"status":"ok"');
          resolve(isHealthy);
        });
      }
    );

    request.on("timeout", () => {
      request.destroy();
      resolve(false);
    });

    request.on("error", () => {
      resolve(false);
    });
  });

const ensurePortIsAvailable = () =>
  new Promise((resolve, reject) => {
    const tester = net.createServer();

    tester.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        resolve(false);
        return;
      }

      reject(error);
    });

    tester.once("listening", () => {
      tester.close(() => resolve(true));
    });

    tester.listen(desiredPort, "0.0.0.0");
  });

const run = async () => {
  try {
    const isPopulensApiRunning = await verifyExistingServer();

    if (isPopulensApiRunning) {
      keepAlive();
      return;
    }

    const isPortAvailable = await ensurePortIsAvailable();

    if (isPortAvailable) {
      startServer();
      return;
    }

    console.error(
      `[dev] Port ${desiredPort} is already in use by another process. Stop that process or change PORT in server/.env before running npm run dev.`
    );
    process.exit(1);
  } catch (error) {
    console.error("[dev] Failed to start backend:", error.message);
    process.exit(1);
  }
};

run();
