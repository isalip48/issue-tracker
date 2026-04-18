import { Schema, model, Document, Types } from "mongoose";

export const ISSUE_STATUSES = [
  "Open",
  "In Progress",
  "Resolved",
  "Closed",
] as const;
export const ISSUE_PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
export const ISSUE_SEVERITIES = [
  "Minor",
  "Major",
  "Critical",
  "Blocker",
] as const;

export type IssueStatus = (typeof ISSUE_STATUSES)[number];
export type IssuePriority = (typeof ISSUE_PRIORITIES)[number];
export type IssueSeverity = (typeof ISSUE_SEVERITIES)[number];

export interface IIssue extends Document {
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  severity: IssueSeverity;
  tags: string[];
  reporter: Types.ObjectId;
  assignee?: Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const IssueSchema = new Schema<IIssue>(
  {
    title: {
      type: String,
      required: [true, "Issue title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    status: {
      type: String,
      enum: {
        values: ISSUE_STATUSES,
        message: `Status must be one of: ${ISSUE_STATUSES.join(", ")}`,
      },
      default: "Open",
    },

    priority: {
      type: String,
      enum: {
        values: ISSUE_PRIORITIES,
        message: `Priority must be one of: ${ISSUE_PRIORITIES.join(", ")}`,
      },
      default: "Medium",
    },

    severity: {
      type: String,
      enum: {
        values: ISSUE_SEVERITIES,
        message: `Severity must be one of: ${ISSUE_SEVERITIES.join(", ")}`,
      },
      default: "Minor",
    },

    tags: {
      type: [String],
      default: [],
      set: (tags: string[]) => tags.map((t) => t.trim().toLowerCase()),
    },

    reporter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Reporter is required"],
    },

    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret["id"] = ret["_id"];
        delete ret["_id"];
        delete ret["__v"];
        return ret;
      },
    },
  },
);

IssueSchema.index({ title: "text", description: "text" });

IssueSchema.index({ status: 1, priority: 1 });

IssueSchema.index({ reporter: 1 });

IssueSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    (this.status === "Resolved" || this.status === "Closed") &&
    !this.resolvedAt
  ) {
    this.resolvedAt = new Date();
  }
  if (
    this.isModified("status") &&
    (this.status === "Open" || this.status === "In Progress")
  ) {
    this.resolvedAt = undefined;
  }
  next();
});

export const Issue = model<IIssue>("Issue", IssueSchema);
