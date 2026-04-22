import { Schema, model, Document, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "qa" | "developer" | "other";
  createdAt: Date;
  updatedAt: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "qa", "developer", "other"],
        message: "Role must be admin, QA, developer, or other",
      },
      default: "developer",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret["_id"] = ret["_id"]?.toString();
        delete ret["__v"];
        delete ret["password"];
        return ret;
      },
    },
  },
);

UserSchema.pre("save", async function (next) {
  const user = this as HydratedDocument<IUser>;

  if (!user.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);

  next();
});

// 🔐 Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// 🔑 Generate reset password token
UserSchema.methods.getResetPasswordToken = function (): string {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire (10 mins)
  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

export const User = model<IUser>("User", UserSchema);