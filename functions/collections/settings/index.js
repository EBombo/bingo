const {firestore} = require("../../config");

const fetchSetting = async settingId => {
    const settings = await firestore.doc(`settings/${settingId}`).get();
    return settings.data();
};

module.exports = {fetchSetting};
