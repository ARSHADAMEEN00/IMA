import { InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    userIdentity: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "customer"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    employeeStatus: {
      type: String,
      default: 'available'
    }
  }
);

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
