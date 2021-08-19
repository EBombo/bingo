const logger = require("../../../utils/logger");
const { firestore } = require("../../../config");

exports.putGame = async (req, res, next) => {
  try {
    logger.log("getGame->", req.params, req.query, req.body);

    const { userId, gameId } = req.params;
    const { folderId } = req.query;
    const game = req.body;

    await firestore
      .collection("games")
      .doc(gameId)
      .update({
        ...game,
        usersIds: [userId],
        parentId: folderId || null,
        updateAt: new Date(),
      });

    res.send({ success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
