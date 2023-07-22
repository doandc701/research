import mongoose from "mongoose";
const { Schema } = mongoose;

const TimeListings = new Schema(
  {
    times: Number,
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("VeseaTimeListings", TimeListings);
