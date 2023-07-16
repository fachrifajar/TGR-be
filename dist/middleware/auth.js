"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const jwt = require("jsonwebtoken");
const ACC_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const validateToken = (req, res, next) => {
    if (!req?.headers?.authorization?.replace("Bearer ", "") &&
        req?.query?.token &&
        req?.cookies?.token) {
        return res.status(401).json({ message: "Unauthorized: Missing token" });
    }
    const token = req?.headers?.authorization?.replace("Bearer ", "") ||
        req?.query?.token ||
        req?.cookies?.token;
    try {
        jwt.verify(token, ACC_TOKEN_SECRET, (err, decoded) => {
            if (err)
                return res.status(401).json({ message: "Token Expired" });
            req.id = decoded.id;
            req.name = decoded.name;
            next();
        });
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};
const isLoggedIn = (req, res, next) => {
    req.user ? next() : res.sendStatus(401);
};
module.exports = { validateToken, isLoggedIn };
//# sourceMappingURL=auth.js.map