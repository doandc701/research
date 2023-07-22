import express from "express";
import {
  getMessageOriginal,
  getMessageBackUp,
  addMessageOriginal,
  editMessageOriginal,
  deleteMessageOriginal,
  addManyMessage,
  updateManyMessage,
  editMessageBackUp,
  deleteManyMessage,
  deleteMessageBackUp,
  runAuto,
} from "../../controllers/MessageController";
import {
  restoreData,
  backupData,
  deleteRecordBackUp,
  deleteRecordRestore,
} from "../../controllers/CheckDataController";

const router = express.Router();


// route backup---restore
router.post("/backup/:id", backupData);
router.delete("/backup/:id", deleteRecordBackUp);
router.post("/restore/:id", restoreData);
router.delete("/restore/:id", deleteRecordRestore);

// routeManyMessage
router.post("/adds", addManyMessage);
router.put("/updates", updateManyMessage);
router.delete("/deletes", deleteManyMessage);

// routeMessageOriginal
router.delete("/:id", deleteMessageOriginal);
router.put("/:id", editMessageOriginal);
router.post("/", addMessageOriginal);
router.get("/", getMessageOriginal);

// routeMessageBackUp
router.delete("/dbbackup/:id", deleteMessageBackUp);
router.put("/dbbackup/:id", editMessageBackUp);
router.get("/dbbackup", getMessageBackUp);



export default router;
