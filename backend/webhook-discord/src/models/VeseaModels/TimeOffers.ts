import mongoose from "mongoose";
const { Schema } = mongoose;

const TimeOffers = new Schema(
  {
    times: Number,
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("VeseaTimeOffers", TimeOffers);
