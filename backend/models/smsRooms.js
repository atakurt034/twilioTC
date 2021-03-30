import mongoose from "mongoose";

const smsRoomSchema = mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Smsmessages" }],
  },
  { timestamps: true }
);

export const Smsroom = mongoose.model("Smsroom", smsRoomSchema);
