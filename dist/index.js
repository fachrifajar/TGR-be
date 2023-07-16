"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const cookieParser = require("cookie-parser");
var middleware = require("./middleware/log");
require("./controller/googleInit");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:3000", "https://link-hub-v1.vercel.app"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(cookieParser());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));
app.use(middleware.logRequest);
app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));
app.use("/post", require("./routes/post"));
app.listen(2626, () => console.log("REST API server ready at: http://localhost:2626"));
//# sourceMappingURL=index.js.map