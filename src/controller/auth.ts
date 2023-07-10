require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ACC_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REF_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const DOMAIN_NAME = process.env.DOMAIN_NAME;
const DOMAIN_EMAIL = process.env.DOMAIN_EMAIL;
const DOMAIN_PWD = process.env.DOMAIN_PWD;
const DOMAIN_HOST = process.env.DOMAIN_HOST;
const DOMAIN_PORT = process.env.DOMAIN_PORT;
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const nodemailer = require("nodemailer");
import { dbRandomInt, generateRandomStr } from "../utils/help";

const register = async (req: Request, res: Response) => {
  interface RegisterRequest {
    email: string;
    pwd: string;
  }

  interface RequestBody {
    email: string;
    pwd: string;
  }

  try {
    const { email, pwd }: RequestBody = req.body;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw { code: 400, message: "Email already registered" };
    }

    const randomInt = await dbRandomInt();

    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser: RegisterRequest = await prisma.user.create({
      data: {
        email,
        pwd: hashedPwd,
        verification_code: randomInt,
      },
    });

    const transporter = nodemailer.createTransport({
      host: DOMAIN_HOST,
      port: DOMAIN_PORT,
      secure: true,
      auth: {
        user: DOMAIN_EMAIL,
        pass: DOMAIN_PWD,
      },
    });

    const mailOptions = {
      from: `${DOMAIN_NAME} <${DOMAIN_EMAIL}>`,
      to: email,
      subject: `Your ${DOMAIN_NAME} Verification Code`,
      html: `
      <div style="background-color: #e6eaed; padding: 20px;">
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #ffffff; display: flex; justify-content: center; align-items: center; width: 300px; margin: 0 auto; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 10px;">
        <div>
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 16px;">${DOMAIN_NAME} Secret Verification Code</h2>
          <p style="margin-bottom: 8px;">Dear ${email},</p>
      
          <p style="margin-bottom: 16px;">This is your ${DOMAIN_NAME} secret verification code: <span style="font-weight: bold; color: #ff5722;">${randomInt}
          <p style="margin-bottom: 8px;">Please never share this code with anyone. Thank you for using our services.</p>
          <p style="margin-bottom: 0;">Best,</p>
          <p style="margin-top: 0;">The ${DOMAIN_NAME} Team</p>
        </div>
      </div>
    </div>
    `,
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(201).json({
      message: `Success created new user: ${email}`,
    });
  } catch (error: any) {
    console.error(error);
    res.status(error?.code ?? 500).json({
      message: error || "Internal Server Error",
    });
  }
};

const login = async (req: Request, res: Response) => {
  interface RequestBody {
    email: string;
    pwd: string;
  }
  try {
    const { email, pwd }: RequestBody = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return res.status(401).json({ message: "Email not found" });

    const isVerified = user?.is_verified;
    if (!isVerified)
      return res.status(401).json({
        message: "Email not verified, Please check your Email / Spam",
      });

    const isPasswordValid = await bcrypt.compare(pwd, user.pwd);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid password" });

    const accessToken = jwt.sign(
      {
        id: user?.id,
        name: user?.username,
      },
      ACC_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        id: user?.id,
        name: user?.username,
      },
      REF_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("refresh", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      sameSite: "none",
      secure: true,
    });

    await prisma.user.update({
      where: { id: user?.id },
      data: {
        ref_token: refreshToken,
      },
    });

    res.status(200).json({
      message: `Login successfull!`,
      data: {
        id: user?.id,
        username: user?.username,
        profile_picture: user?.profile_picture,
        accessToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const verify = async (req: Request, res: Response) => {
  interface RequestBody {
    verification_code: number;
  }
  try {
    const { verification_code }: RequestBody = req.body;

    const user = await prisma.user.findUnique({
      where: { verification_code },
    });

    if (!user)
      return res.status(401).json({ message: "Verification code not valid" });

    await prisma.user.update({
      where: { id: user?.id },
      data: {
        verification_code: null,
        is_verified: true,
      },
    });

    res.status(200).json({
      message: `Email Verified!`,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const resendVerification = async (req: Request, res: Response) => {
  interface RequestBody {
    email: string;
  }
  try {
    const { email }: RequestBody = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return res.status(401).json({ message: "Email not found" });

    if (user?.is_verified === true)
      return res.status(401).json({ message: "Email already verified!" });

    const transporter = nodemailer.createTransport({
      host: DOMAIN_HOST,
      port: DOMAIN_PORT,
      secure: true,
      auth: {
        user: DOMAIN_EMAIL,
        pass: DOMAIN_PWD,
      },
    });

    const mailOptions = {
      from: `${DOMAIN_NAME} <${DOMAIN_EMAIL}>`,
      to: email,
      subject: `Your ${DOMAIN_NAME} Verification Code`,
      html: `
      <div style="background-color: #e6eaed; padding: 20px;">
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #ffffff; display: flex; justify-content: center; align-items: center; width: 300px; margin: 0 auto; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 10px;">
        <div>
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 16px;">${DOMAIN_NAME} Secret Verification Code</h2>
          <p style="margin-bottom: 8px;">[RESEND]</p>
          <p style="margin-bottom: 8px;">Dear ${email},</p>
      
          <p style="margin-bottom: 16px;">This is your ${DOMAIN_NAME} secret verification code: <span style="font-weight: bold; color: #ff5722;">${user?.verification_code}</span></p>
      
          <p style="margin-bottom: 8px;">Please never share this code with anyone. Thank you for using our services.</p>
          <p style="margin-bottom: 0;">Best,</p>
          <p style="margin-top: 0;">The ${DOMAIN_NAME} Team</p>
        </div>
      </div>
    </div>
      `,
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({
      message: `Re-send verification code success`,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const sendResetUrl = async (req: Request, res: Response) => {
  interface RequestBody {
    email: string;
  }
  try {
    const { email }: RequestBody = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) return res.status(401).json({ message: "Email not found" });

    if (!user?.is_verified)
      return res.status(401).json({
        message: "Email not verified, Please check your Email / Spam",
      });

    const getRandomStr = generateRandomStr(128);

    await prisma.user.update({
      where: { email },
      data: {
        reset_token: getRandomStr,
      },
    });

    const transporter = nodemailer.createTransport({
      host: DOMAIN_HOST,
      port: DOMAIN_PORT,
      secure: true,
      auth: {
        user: DOMAIN_EMAIL,
        pass: DOMAIN_PWD,
      },
    });

    const mailOptions = {
      from: `${DOMAIN_NAME} <${DOMAIN_EMAIL}>`,
      to: email,
      subject: `Your ${DOMAIN_NAME} Verification Code`,
      html: `
      <div style="background-color: #e6eaed; padding: 20px;">
      <div style="font-family: Arial, sans-serif; color: #333; background-color: #ffffff; display: flex; justify-content: center; align-items: center; width: 300px; margin: 0 auto; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); border-radius: 10px;">
        <div>
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 16px;">Password Reset</h2>
          <p style="margin-bottom: 8px;">Dear ${email},</p>
      
          <p style="margin-bottom: 16px;">Click the following link to reset your password: <a href="http://localhost:3000/reset-password?email=${email}&token=${getRandomStr}" style="font-weight: bold;">LINK</a></p>
            
          <p style="margin-bottom: 0;">Best,</p>
          <p style="margin-top: 0;">The ${DOMAIN_NAME} Team</p>
        </div>
      </div>
    </div>
        `,
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({
      message: `Reset Email link sent!`,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPwd = async (req: Request, res: Response) => {
  type RequestBody = {
    pwd: string;
    email: string;
    reset_token: string;
  };

  try {
    const { pwd, email, reset_token }: RequestBody = req.body;
    const hashedPwd = await bcrypt.hash(pwd, 10);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user?.reset_token !== reset_token)
      return res.status(401).json({
        message: "USER NOT AUTHORIZED",
      });

    await prisma.user.update({
      where: { email },
      data: {
        pwd: hashedPwd,
        reset_token: null,
      },
    });

    res.status(201).json({
      message: `Success reset password`,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refresh;

    const user = await prisma.user.findFirst({
      where: { ref_token: refreshToken },
    });

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token found" });
    }

    jwt.verify(refreshToken, REF_TOKEN_SECRET, (err: any, decoded: any) => {
      if (err) return res.status(401).json({ message: "Token Expired" });

      const getRefreshToken = jwt.sign(
        {
          id: user?.id,
          name: user?.username,
        },
        ACC_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "Successfully retrieved refresh token",
        data: {
          getRefreshToken,
        },
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const googleAuth = async (req: Request, res: Response) => {
  res.send("Hello There");
};

const googleFailure = async (req: Request, res: Response) => {
  res.send("Something went wrong!");
};

module.exports = {
  register,
  login,
  verify,
  resendVerification,
  sendResetUrl,
  resetPwd,
  refreshToken,
  googleAuth,
  googleFailure,
};
