import { runAuto } from "../controllers/MessageController";
import {
  checkRecordBackUp,
  checkRecordRestore,
} from "../controllers/CheckDataController";
import messageRouter from "./modules/messages";
export const routes = (app: any) => {
  app.use("/message", messageRouter);

  app.get("/", checkRecordBackUp);
  app.get("/check-restore", checkRecordRestore);
  app.get("/check-auto", runAuto);
};
