"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logRequest = (req, res, next) => {
    console.log("Request running on Path:", req.originalUrl);
    console.log("Request type:", req.method);
    next();
};
const urlValidator = (req, res) => {
    res.status(404).json({
        message: "404",
    });
};
module.exports = { logRequest, urlValidator };
//# sourceMappingURL=log.js.map