import { Request, Response } from "express";
import { User } from "../models/User";
import { generateTokens, verifyRefreshToken } from "../utils/jwt";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        user,
        ...tokens,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
      return;
    }

    const tokens = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user,
        ...tokens,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
      return;
    }

    const { accessToken } = generateTokens({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);

    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
