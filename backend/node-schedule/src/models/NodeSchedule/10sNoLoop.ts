import mongoose from "mongoose";
const { Schema } = mongoose;

const nodeSchedule = new Schema(
  {
    data2: [{ name: String }],
  },
  {
    timestamps: true,
  }
);
export const Object10s = mongoose.model("10sNoLoop", nodeSchedule);
