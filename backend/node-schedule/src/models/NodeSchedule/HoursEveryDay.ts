import mongoose from "mongoose";
const { Schema } = mongoose;

const nodeSchedule = new Schema(
  {
    data3: [{ name: String }],
  },
  {
    timestamps: true,
  }
);
export const ObjectHoursEveryDay = mongoose.model(
  "HoursEveryDay",
  nodeSchedule
);
