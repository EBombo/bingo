const logger = require("../functions/utils/logger");
const bodyParser = require("body-parser");
const { default: next } = require("next");
const express = require("express");
const cors = require("cors");

const isDev = process.env.NODE_ENV !== "production";

const server = next({
  dev: isDev,
  conf: { distDir: ".next" },
});

const nextHandle = server.getRequestHandler();

const serverExpress = express();

serverExpress.use(cors({ origin: "*" }));

serverExpress.use(bodyParser.json());

serverExpress.use(bodyParser.urlencoded({ extended: false }));

serverExpress.all("*", async (req, res, next) => {
  try {
    await server.prepare();

    await nextHandle(req, res);
  } catch (error) {
    logger.log("error", error);
    next(error);
  }
});

module.exports = { serverExpress };
