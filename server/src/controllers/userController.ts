import { Request, Response } from "express";
import { User } from "../models/User";

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("name email role").sort({ name: 1 });

    res.status(200).json({ success: true, data: { users } });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
