const {firestore} = require("../../config");
const logger = require("../../utils/logger");

const fetchUsers = async () => {
    return null;
};

const fetchUser = async (userId) => {
    const userRef = await firestore.doc(`users/${userId}`).get();
    return userRef.data();
};

const updateUser = async (userId, user) =>
    await firestore.doc(`users/${userId}`).update(user);

module.exports = {fetchUsers, fetchUser, updateUser};
