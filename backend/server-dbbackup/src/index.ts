import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { mongooseConnect, backupMongooseConnect } from "./config/db";
import { routes } from "./routes/index";
import { checkStartServer } from "./controllers/CheckDataController";
import { loop10s } from "./services/scheduleJobs";
const app = express();
const port = 3000;

const corsOptions = {
  origin: "http://localhost:8000",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(express.json());
app.use(bodyParser.json());
app.use(cors(corsOptions));

routes(app);

// connect multi mongoose
try {
  mongooseConnect;
  backupMongooseConnect;
} catch (err) {
  console.log("Connect failed!", err);
}
// checkIntegrity();
app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`);
  // loop10s();
  checkStartServer();
});
