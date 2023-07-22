import mongoose from "mongoose";
const { Schema } = mongoose;

const nodeSchedule = new Schema(
  {
    data: [{ name: String }],
  },
  {
    timestamps: true,
  }
);
export const Object5s = mongoose.model("5sLoop", nodeSchedule);
