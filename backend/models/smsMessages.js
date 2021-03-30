import mongoose from "mongoose";

const smsMessageSchema = mongoose.Schema(
  {
    status: {
      type: String,
    },
    message: {
      type: String,
    },
    to: {
      type: String,
    },
    from: {
      type: String,
    },
  },
  { timestamps: true }
);
export const Smsmessage = mongoose.model("Smsmessage", smsMessageSchema);
