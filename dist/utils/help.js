"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomStr = exports.dbRandomInt = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const dbRandomInt = async () => {
    let randomInt = generateRandomInt();
    while (await isVerificationCodeExists(randomInt)) {
        randomInt = generateRandomInt();
    }
    return randomInt;
};
exports.dbRandomInt = dbRandomInt;
const generateRandomInt = () => {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const isVerificationCodeExists = async (code) => {
    const existingUser = await prisma.user.findFirst({
        where: { verification_code: code },
    });
    return existingUser !== null;
};
const generateRandomStr = (length) => {
    const characterSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characterSet.length);
        randomString += characterSet[randomIndex];
    }
    return randomString;
};
exports.generateRandomStr = generateRandomStr;
//# sourceMappingURL=help.js.map