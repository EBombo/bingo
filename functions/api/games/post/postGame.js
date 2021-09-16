const logger = require("../../../utils/logger");
const { firestore } = require("../../../config");

exports.postGame = async (req, res, next) => {
  try {
    logger.log("postGame->", req.params, req.query, req.body);

    const { userId } = req.params;
    const { folderId } = req.query;
    const game = req.body;
    const gamesRef = firestore.collection("games");
    const gameId = game.id;

    await gamesRef.doc(gameId).set({
      ...game,
      id: gameId,
      usersIds: [userId],
      parentId: folderId || null,
      createAt: new Date(),
      updateAt: new Date(),
      deleted: false,
    });

    res.send({ success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
