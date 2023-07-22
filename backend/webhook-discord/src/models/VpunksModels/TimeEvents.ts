import mongoose from "mongoose";
const { Schema } = mongoose;

const VpunksMarketTimes = new Schema(
  {
    times: Number,
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("VpunksMarketTimes", VpunksMarketTimes);
