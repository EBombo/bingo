const logger = require("../../../utils/logger");
const { firestore } = require("../../../config");

exports.postMessage = async (req, res, next) => {
  try {
    logger.log("postMessage->", req.params, req.query, req.body);

    const { user, message, lobbyId } = req.body;
    const messagesRef = firestore.collection("messages");
    const messageId = messagesRef.id;

    await messagesRef.doc(messageId).set({
      id: messageId,
      createAt: new Date(),
      updateAt: new Date(),
      deleted: false,
      message,
      user,
      lobbyId,
    });

    res.send({ success: true });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
