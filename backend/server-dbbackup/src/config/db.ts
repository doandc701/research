import { connect } from "http2";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

let dbConnetion: any;
const uriCloud: string =
  "mongodb+srv://books:j7yjNzJntNrwXHxp@clbook.lvbipmz.mongodb.net/?retryWrites=true&w=majority";
const uriLocal: string = "mongodb://localhost:27017/test";
export const connectToDb = (callback: any) => {
  MongoClient.connect(uriCloud)
    .then((client) => {
      dbConnetion = client.db();
      return callback();
    })
    .catch((error) => {
      console.log(error);
      return callback(error);
    });
};
export const getDb = () => dbConnetion;

// export const connectMongoose = async () => {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/mongoseConnect");
//     console.log("Connect successfully!");
//   } catch (err) {
//     console.log("Connect failed!", err);
//   }
// };

// config multi mongodb

function newConnection(uri: any) {
  const db = mongoose.createConnection(uri, { connectTimeoutMS: 60 * 1000 });
  console.log(`Connect successfully ${uri}!`);
  return db;
}

async function disconnectDb() {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.log("error----", error);
  }
}

const { MONGOOSE_CONNECT, BACKUP_MONGOOSE_CONNECT } = process.env;

const mongooseConnect = newConnection(MONGOOSE_CONNECT);
const backupMongooseConnect = newConnection(BACKUP_MONGOOSE_CONNECT);

export { mongooseConnect, backupMongooseConnect, disconnectDb };
