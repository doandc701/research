import mongoose from "mongoose";
const { Schema } = mongoose;

const test = new Schema(
  {
    name: String,
    slug: { type: String, unique: true },
  },
  {
    timestamps: true,
  }
);
export const ObjeTest = mongoose.model("Test", test);
