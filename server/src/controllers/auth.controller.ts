import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { prisma } from "../db";
import { addMinutes } from "date-fns";
import { sendVerificationEmail } from "../utils/email.config";

// TO DO
// DELETE ACCOUNT
// LOGOUT
// RESEND VERIFICATION EMAIL
// GOOGLE SIGNUP
// MERGE GOOGLE AND NORMAL EMAIL SIGNUP
// UPDATE DETAILS

// SIGN UP NEW USER
export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = Math.floor(
      10000 + Math.random() * 90000
    ).toString();

    const newUser = await prisma.user.create({
      data: {
        username: name,
        email,
        hashedPassword: hashedPassword,
        role: "USER",
        verificationCode,
        verificationCodeExpires: addMinutes(new Date(), 30),
      },
    });

    sendVerificationEmail(
      newUser.username,
      newUser.email,
      verificationCode
    ).catch(console.error);
    const token = jwt.sign(
      { email: newUser.email, id: newUser.userId },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: { token, user: newUser },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong.", error: error });
  }
};

// SIGN IN EXISTING USER
export const signIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: "Incorrect password" });
      return;
    }

    const token = jwt.sign(
      { email: user.email, id: user.userId },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong", error: error });
  }
};

// VERIFY EMAIL
export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { code } = req.query;

  try {
    const user = await prisma.user.findFirst({
      where: {
        verificationCode: code as string,
        verificationCodeExpires: {
          gt: new Date(), // Ensure it's not expired
        },
      },
    });

    if (!user) {
      res
        .status(404)
        .json({
          success: false,
          message: "Invalid or expired verification code.",
        });
    }

    const updatedUser = await prisma.user.update({
      where: { userId: user?.userId },
      data: {
        verified: true,
        verificationCode: null,
        verificationCodeExpires: null,
      },
    });

    // CHANGE TO FRONTEND PAGE....
    res
      .status(200)
      .json({
        success: true,
        message: "Email Account Verified",
        data: { user: updatedUser },
      });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
    return;
  }
};
