import { Schema, model, Document, HydratedDocument } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "developer" | "viewer";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
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
        values: ["admin", "developer", "viewer"],
        message: "Role must be admin, developer, or viewer",
      },
      default: "developer",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        ret["id"] = ret["_id"];
        delete ret["_id"];
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

export const User = model<IUser>("User", UserSchema);