const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { getSeo } = require("./seo/get");
const { getError } = require("./error/getError");
const { postError } = require("./error");
const { getManifest } = require("./manifest/get");
const { getResendVerifyCode } = require("./users/get");
const { getVerifyCode } = require("./users/get");
const { validateRequest } = require("./validateRequest");
const { deleteUser } = require("./users/delete");
const { putUpdateUser } = require("./users/put");
const { postUser } = require("./users/post");
const { validateAdmin } = require("./validateAdmin");
const { getGames } = require("./games/get");
const { postGame } = require("./games/post");

const api = express();
const router = express.Router();
const routerSeo = express.Router();

router.use(cors({ origin: "*" }));

router.use(bodyParser.json());

router.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res) => res.send("Hello!"));

router.post("/users/:userId", validateRequest, postUser);

router.put("/users/:userId/edit", validateAdmin, putUpdateUser);

router.delete("/users/:userId", validateRequest, deleteUser);

router.get(
  "/verify/:userId/verification-code/:verificationCode",
  getVerifyCode
);

router.get("/verify/:userId/resend-code", getResendVerifyCode);

router.get("/manifest", getManifest);

//----------------manage games---------------

router.get("/games/users/:userId", getGames);

router.post("/games/:gameId/users/:userId", postGame);

router.put("/games/:gameId/:gameId/users/:userId", putGame);

//---------------------------------------------

router.post("/error-boundary", postError);

router.get("/error-vanilla", getError);

api.use("/api", router);

routerSeo.all("*", getSeo);

api.use("/api/seo", routerSeo);

module.exports = { api };
