import { Schema } from "mongoose";
import { mongooseConnect, backupMongooseConnect } from "../config/db";

const message = new Schema(
  {
    // msg: String,
    msg: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);
const ObjectMessage = mongooseConnect.model("message", message);
const ObjectMessageBackUp = backupMongooseConnect.model("message", message);
export { ObjectMessage, ObjectMessageBackUp };
