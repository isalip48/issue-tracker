import { Schema, model, Document, Types } from "mongoose";

export interface IActivityLog extends Document {
  issue: Types.ObjectId;
  user: Types.ObjectId;
  action: string;
  changes: Record<string, { from: unknown; to: unknown }>;
  timestamp: Date;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    issue: {
      type: Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    changes: {
      type: Schema.Types.Mixed,
      default: {},
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: false },
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret["_id"] = ret["_id"]?.toString();
        delete ret["__v"];
        return ret;
      },
    },
  },
);

ActivityLogSchema.index({ issue: 1, timestamp: -1 });

export const ActivityLog = model<IActivityLog>(
  "ActivityLog",
  ActivityLogSchema,
);
