import { Schema, model, Document, Types } from "mongoose";

export interface IProject extends Document {
  name: string;
  description?: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      unique: true,
      trim: true,
      minlength: [2, "Project name must be at least 2 characters"],
      maxlength: [50, "Project name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret["_id"] = ret["_id"]?.toString();
        delete ret["__v"];
        return ret;
      },
    },
  }
);

export const Project = model<IProject>("Project", ProjectSchema);
