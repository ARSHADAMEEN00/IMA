import { InferSchemaType, Schema, model } from "mongoose";

const kuri = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    emiAmount: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    installments: [
      {
        InstallmentNo: {
          type: Number,
        },
        date: {
          type: Date,
        },
        isCompleted: { type: Boolean, default: false },
      }
    ],
    isCompleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);




type Kuri = InferSchemaType<typeof kuri>;

export default model<Kuri>("kuri", kuri);
