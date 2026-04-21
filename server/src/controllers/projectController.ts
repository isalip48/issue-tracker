import { Request, Response } from "express";
import { Project } from "../models/Project";
import { Issue } from "../models/Issue";
import mongoose from "mongoose";

export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const userId = req.user!.userId;

    const project = await Project.create({
      name,
      description,
      createdBy: userId,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: { project },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getProjects = async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await Project.find().populate("createdBy", "name email").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { projects },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid project ID" });
      return;
    }

    const project = await Project.findById(id).populate("createdBy", "name email");

    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    res.status(200).json({ success: true, data: { project } });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid project ID" });
      return;
    }

    const project = await Project.findByIdAndUpdate(
      id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: { project },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid project ID" });
      return;
    }

    // Check if there are any issues linked to this project
    const issueCount = await Issue.countDocuments({ project: id });

    if (issueCount > 0) {
      res.status(400).json({
        success: false,
        message: "Cannot delete project with existing issues. Please reassign or delete the issues first.",
      });
      return;
    }

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      res.status(404).json({ success: false, message: "Project not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
