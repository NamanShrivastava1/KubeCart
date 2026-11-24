import app from "./src/app.js";
import expressProxy from "express-http-proxy";

import { config } from "./src/config/config.js";
import logger from "./src/utils/logger.js";

app.use("/user", expressProxy("http://localhost:3001"));
app.use("/product", expressProxy("http://localhost:3002"));
app.use("/notification", expressProxy("http://localhost:3003"));

const server = app.listen(config.PORT, () => {
  logger.info(
    {
      port: config.PORT,
      environment: config.NODE_ENV,
    },
    "Gateway started",
  );
});

server.on("error", (error) => {
  logger.fatal({ err: error }, "Gateway failed to start");
  process.exitCode = 1;
});
