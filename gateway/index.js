import express from "express";
import expressProxy from "express-http-proxy";

import { config } from "./src/config/config.js";

const app = express();

app.use("/user", expressProxy("http://localhost:3001"));
app.use("/product", expressProxy("http://localhost:3002"));

const startServer = async () => {
  try {
    app.listen(config.PORT, () => {
      console.log("Gateway Started", {
        port: config.PORT,
        env: config.NODE_ENV,
      });
    });
  } catch (error) {
    console.error("Error starting server", { error: error.message });
    process.exit(1);
  }
};

startServer();
