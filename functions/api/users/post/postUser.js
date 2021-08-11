const {firestore} = require("../../../config");
const logger = require("../../../utils/logger");
const {fetchSetting} = require("../../../collections/settings");
const {searchName} = require("../../../utils");
const {sendEmail} = require("../../../email/sendEmail");
const {config} = require("../../../config");
const {get, defaultTo} = require("lodash");

const postUser = async (req, res, next) => {
    try {
        logger.log("user register->", req.body);

        const user = req.body;
        const origin = get(req, "headers.origin", config.serverUrl);

        user.id = req.params.userId;

        if (!user.email)
            return res.status(412).send({
                statusText: "invalid-email",
                message: "Email es requerido",
            });

        const email = get(user, "email", "").trim();
        const phoneNumber = get(user, "phoneNumber", null);

        const promiseEmail = isEmailAlreadyExists(email);
        const promisePhone = user.providerData.providerId === "password"
            ? await isPhoneNumberAlreadyExists(phoneNumber)
            : false;
        const promiseUser = isUserExists(user.id);

        const responseUser = await Promise.all([promiseEmail, promisePhone, promiseUser]);
        logger.log("responseUser", responseUser);

        const emailAlreadyExists = responseUser[0];
        const phoneNumberAlreadyExists = responseUser[1];
        const userExists = responseUser[2];

        if (emailAlreadyExists)
            return res.status(412).send({
                statusText: "email-already-exists",
                message: "Email ya esta registrado",
            });

        if (emailAlreadyExists && !userExists)
            return res.status(412).send({
                statusText: "email-already-exists",
                message: "Email ya esta registrado",
            });

        if (phoneNumberAlreadyExists && !userExists)
            return res.status(412).send({
                statusText: "phone-number-already-exists",
                message: "Número telefónico ya esta registrado",
            });

        let verificationCode = Math.floor(1000 + Math.random() * 9000);
        let isVerified = user.providerData.providerId !== "password";

        await setUser(user, verificationCode, isVerified, origin);

        await sendMessage(user, verificationCode, origin);

        return res.send({success: true});
    } catch (error) {
        next(error);
    }
};

const isEmailAlreadyExists = async email => {
    if (!email) return false;

    const userQuerySnapshot = await firestore
        .collection("users")
        .where("email", "==", email)
        .get();

    return !userQuerySnapshot.empty;
};

const isPhoneNumberAlreadyExists = async (phoneNumber) => {
    if (!phoneNumber) return false;

    const userQuerySnapshot = await firestore
        .collection("users")
        .where("phoneNumber", "==", phoneNumber)
        .get();

    return !userQuerySnapshot.empty;
};

const isUserExists = async (userId) => {
    const userDocumentSnapshot = await firestore
        .collection("users")
        .doc(userId)
        .get();

    return userDocumentSnapshot.exists;
};

const setUser = async (user, verificationCode, isVerified, origin) => {
    const email = get(user, "email", "");
    const phoneNumber = get(user, "phoneNumber", null);

    await firestore
        .collection("users")
        .doc(user.id)
        .set({
            id: user.id,
            name: get(user, "name", null),
            lastName: get(user, "lastName", null),
            searchName: searchName({...user, phoneNumber, email}),
            email: defaultTo(email, "").toLowerCase(),
            providers: [get(user, "providerData.providerId", "")],
            dialCode: get(user, "dialCode", null),
            createAt: new Date(),
            updateAt: new Date(),
            phoneNumber: phoneNumber,
            countryCode: get(user, "countryCode", null),
            verificationCode,
            isVerified,
            origin,
            theme: get(user, "theme", "darkTheme")
        }, {merge: true});
};

const sendMessage = async (user, verificationCode, origin) => {
    try {
        const templates = await fetchSetting("templates");
        const verifyCode = templates["verifyCode"];
        const newAccount = templates["newAccount"];

        if (user.providerData.providerId === "password")
            return await sendVerificationCodeEmail(user, verificationCode, origin, verifyCode);

        await sendWelcomeEmail(user, origin, newAccount);
    } catch (error) {
        logger.error(error);
    }
};

const sendVerificationCodeEmail = async (user, verificationCode, origin, template) =>
    await sendEmail(user.email.trim(),
        get(template, "subject", "Bienvenido a eBombo, porfavor confirma tu correo electrónico"),
        template.content,
        {
            userName: get(user, "name", ""),
            userEmail: user.email.trim(),
            verifyAccountLink: `${origin}/api/verify/${user.id}/verification-code/${verificationCode}`,
            code: verificationCode
        });

const sendWelcomeEmail = async (user, origin, template) =>
    await sendEmail(user.email.trim(),
        get(template, "subject", "Bienvenido"),
        template.content,
        {
            userName: get(user, "name", ""),
            userEmail: user.email.trim(),
        });

module.exports = {postUser};
