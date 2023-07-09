import express from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors";
import path from "path";
const cookieParser = require("cookie-parser");
var middleware = require("./middleware/log");
var authMiddleware = require("./middleware/auth");
require("./controller/googleInit");
const passport = require("passport");
import { Request, Response } from "express";
const session = require("express-session");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://link-hub-v1.vercel.app"],
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(middleware.logRequest);

app.use("/auth", require("./routes/auth"));

// app.use(
//   session({
//     secret: "mysecret",
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: false },
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session())
// app.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["email", "profile"] })
// );

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/login",
//     successRedirect: "/login",
//   })
// );

// app.get("/auth/google/failure", (req: Request, res: Response) => {
//   res.send("Something went wrong!");
// });

// app.get(
//   "/auth/protected",
//   authMiddleware.isLoggedIn,
//   (req: Request, res: Response) => {
//     res.send("Hello There");
//   }
// );

app.listen(2626, () =>
  console.log("REST API server ready at: http://localhost:2626")
);
