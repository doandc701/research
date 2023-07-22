import express from "express";
import { connectToDb, getDb, connectMongoose } from "./config/db";
import { routes } from "./routes/index";
import { run10send } from "./controllers/libNodeSchedule";

const app = express();
const port = 3000;

app.use(express.json());
routes(app);

export let db: any;
// connectToDb((error: string) => {
//   if (!error) {
//     db = getDb();
//   }
// });
run10send;
connectMongoose();

// app.listen(port, () => {
//   console.log(`app listening on port http://localhost:${port}`);
// });
