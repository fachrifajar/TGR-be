"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});
app.listen(3000, () => console.log("REST API server ready at: http://localhost:3000"));
//# sourceMappingURL=index.js.map