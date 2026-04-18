import { Request, Response } from "express";
import { Issue } from "../models/Issue";
import { ActivityLog } from "../models/ActivityLog";
import mongoose from "mongoose";

const logActivity = async (
  issueId: string,
  action: string,
  userId: string,
  changes: Record<string, { from: unknown; to: unknown }> = {},
) => {
  try {
    await ActivityLog.create({ issue: issueId, user: userId, action, changes });
  } catch (err) {
    console.error("Activity Log Failed:", err);
  }
};

export const createIssue = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, status, priority, severity, tags, assignee } =
      req.body;
    const reporterId = req.user!.userId;

    const issue = await Issue.create({
      title,
      description,
      status,
      priority,
      severity,
      tags,
      assignee: assignee || null,
      reporter: reporterId,
    });

    await issue.populate("reporter", "name email");
    if (issue.assignee) await issue.populate("assignee", "name email");

    await logActivity(issue._id.toString(), reporterId, "Created issue", {});

    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: { issue },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getIssues = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || undefined;
    const status = (req.query.status as string) || undefined;
    const priority = (req.query.priority as string) || undefined;
    const severity = (req.query.severity as string) || undefined;
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const order = (req.query.order as string) || "desc";

    const filter: mongoose.FilterQuery<typeof Issue> = {};

    if (search) {
      filter.$text = { $search: search };
    }
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (severity) filter.severity = severity;

    const sortOrder = order === "asc" ? 1 : -1;
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

    const skip = (page - 1) * limit;

    const [issues, total] = await Promise.all([
      Issue.find(filter)
        .populate("reporter", "name email")
        .populate("assignee", "name email")
        .sort(sort)
        .skip(skip)
        .limit(limit),

      Issue.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: { issues },
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getIssueById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid issue ID" });
      return;
    }

    const issue = await Issue.findById(id)
      .populate("reporter", "name email")
      .populate("assignee", "name email");

    if (!issue) {
      res.status(404).json({ success: false, message: "Issue not found" });
      return;
    }

    res.status(200).json({ success: true, data: { issue } });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const updateIssue = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid issue ID" });
      return;
    }

    const existingIssue = await Issue.findById(id);
    if (!existingIssue) {
      res.status(404).json({ success: false, message: "Issue not found" });
      return;
    }

    const changes: Record<string, { from: unknown; to: unknown }> = {};
    const updatableFields = [
      "title",
      "description",
      "status",
      "priority",
      "severity",
      "tags",
      "assignee",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        const oldVal = existingIssue.get(field);
        const newVal = req.body[field];
        if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
          changes[field] = { from: oldVal, to: newVal };
        }
      }
    });

    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true },
    )
      .populate("reporter", "name email")
      .populate("assignee", "name email");

    const changedFields = Object.keys(changes);
    const action =
      changedFields.length > 0
        ? `Updated ${changedFields.join(", ")}`
        : "Updated issue (no changes)";

    await logActivity(id, req.user!.userId, action, changes);

    res.status(200).json({
      success: true,
      message: "Issue updated successfully",
      data: { issue: updatedIssue },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const deleteIssue = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid issue ID" });
      return;
    }

    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      res.status(404).json({ success: false, message: "Issue not found" });
      return;
    }

    await ActivityLog.deleteMany({ issue: id });

    res.status(200).json({
      success: true,
      message: "Issue deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getIssueStats = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const stats = await Issue.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statsByStatus = stats.reduce(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    const priorityStats = await Issue.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const statsByPriority = priorityStats.reduce(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      {} as Record<string, number>,
    );

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const trend = await Issue.aggregate([
      {
        $match: { createdAt: { $gte: sevenDaysAgo } },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const totalIssues = await Issue.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        total: totalIssues,
        byStatus: {
          Open: statsByStatus["Open"] || 0,
          "In Progress": statsByStatus["In Progress"] || 0,
          Resolved: statsByStatus["Resolved"] || 0,
          Closed: statsByStatus["Closed"] || 0,
        },
        byPriority: {
          Low: statsByPriority["Low"] || 0,
          Medium: statsByPriority["Medium"] || 0,
          High: statsByPriority["High"] || 0,
          Critical: statsByPriority["Critical"] || 0,
        },
        trend,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

export const getIssueActivity = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid issue ID" });
      return;
    }

    const activity = await ActivityLog.find({ issue: id })
      .populate("user", "name email")
      .sort({ timestamp: -1 });

    res.status(200).json({ success: true, data: { activity } });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
};
