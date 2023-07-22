import { NextFunction, Request, Response } from "express";
import { ObjectMessage, ObjectMessageBackUp } from "../models/message";
import { loop10s } from "../services/scheduleJobs";
import { disconnectDb } from "../config/db";
import { objectQueue } from "../stores/data";

const limitPage = 5;
async function getMessageOriginal(req: Request, res: Response) {
  let perPage = limitPage;
  let page = Number(req.query.page) || 1;
  let skip = perPage * page - perPage;
  let array1 = [];
  const dataOriginal = await ObjectMessage.find()
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(perPage);
  const countObjectMessage = await ObjectMessage.countDocuments();
  array1.push({
    dataOriginal,
    page,
    pages: Math.ceil(countObjectMessage / perPage),
  });
  res.status(200).json(array1);
}
async function getMessageBackUp(req: Request, res: Response) {
  let perPage = limitPage;
  let page = Number(req.query.page) || 1;
  let skip = perPage * page - perPage;
  let array2 = [];
  const dataBackUp = await ObjectMessageBackUp.find()
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(perPage);
  const countObjectMessageBackUp = await ObjectMessageBackUp.countDocuments();
  array2.push({
    dataBackUp,
    page,
    pages: Math.ceil(countObjectMessageBackUp / perPage),
  });
  res.status(200).json(array2);
}

// db messageOriginal
async function addMessageOriginal(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("req.body", req.body);
  const model1 = new ObjectMessage(req.body);
  try {
    const doc = await model1.save();
    objectQueue.unshift({
      type: "insert",
      item: doc,
    });
    res.json(doc);
  } catch (error) {
    // console.log(error);
    res.json(error);
  }
}

async function editMessageOriginal(req: Request, res: Response) {
  await ObjectMessage.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
  })
    .then(async (doc) => {
      for (let i = 0; i < objectQueue.length; i++) {
        if (objectQueue[i].type === "update") {
          if (objectQueue[i].item._id.toString() === doc?._id.toString()) {
            objectQueue.splice(i, 1);
          }
        }
      }
      objectQueue.unshift({
        type: "update",
        item: doc,
      });
      // console.log("objectQueue", objectQueue);
      res.json(doc);
    })
    .catch((error) => {
      // console.log(error);
      res.json(error);
    });
}

async function deleteMessageOriginal(req: Request, res: Response) {
  // console.log("req.params.id", req.params.id);
  const deleted = await ObjectMessage.findByIdAndDelete(req.params.id).catch(
    (error) => {
      res.json(error);
      console.log(error);
    }
  );
  if (!deleted) return;
  for (let i = 0; i < objectQueue.length; i++) {
    if (objectQueue[i].item._id.toString() === deleted._id.toString()) {
      objectQueue.splice(i, 2);
    }
  }
  objectQueue.unshift({
    type: "delete",
    item: deleted,
  });
  // console.log("objectQueue", objectQueue);
  res.send("Deleted success !");
}

// db messagesBackUp
async function editMessageBackUp(req: Request, res: Response) {
  // console.log("req.body", req.params.id, req.body);
  await ObjectMessageBackUp.findByIdAndUpdate(req.params.id, req.body, {
    returnDocument: "after",
  })
    .then(async (doc) => {
      res.json(doc);
    })
    .catch((error) => {
      res.json(error);
      console.log(error);
    });
}

async function deleteMessageBackUp(req: Request, res: Response) {
  // console.log("req.params.id", req.params.id);
  await ObjectMessageBackUp.findByIdAndDelete(req.params.id)
    .then((deleted: any) => {
      console.log("Deleted success !");
      res.send("Deleted success !");
    })
    .catch((error: any) => {
      res.json(error);
      console.log(error);
    });
}

// handleMany
async function addManyMessage(req: Request, res: Response, next: NextFunction) {
  if (objectQueue.length > 0) {
    let queueInsert = objectQueue.filter((item: any) => item.type === "insert");
    console.log("queueInsert", queueInsert);
    if (queueInsert.length <= 0) return;
    const mapId = queueInsert.map((itemQ: any) => itemQ.item._id);
    let mapData = queueInsert.map((itemData: any) => itemData.item);
    // disconnectDb();
    const handleDeleteAddMany = await ObjectMessageBackUp.deleteMany({
      _id: { $in: mapId },
    }).catch((error) => {
      console.log("error", error);
      res.json(error);
    });
    if (!handleDeleteAddMany?.acknowledged) return;
    console.log("handleDeleteAddMany", handleDeleteAddMany);
    const handleInsertAddMany = await ObjectMessageBackUp.insertMany(mapData, {
      ordered: false,
      rawResult: true,
    }).catch((error) => {
      console.log("Duplicate key", error);
    });
    if (!handleInsertAddMany) {
      const recordBackUp = await ObjectMessageBackUp.find({
        _id: { $in: mapId },
      });
      // lọc id lỗi
      const idDiff = mapId.filter(
        (item: any) =>
          !recordBackUp.find(
            (doc) => doc._id.toString() === item._id.toString()
          )
      );
      // hiển thị bản ghi lỗi
      const filterRecordError = mapData.filter((item: any) =>
        idDiff.find(
          (itemId: any) => itemId._id.toString() === item._id.toString()
        )
      );
      console.log("filterRecordError", filterRecordError);
    } else {
      console.log("addManyMessage success!", handleInsertAddMany);
      res.send("Insert Success!");
    }
  }
}

async function updateManyMessage(req: Request, res: Response) {
  if (objectQueue.length > 0) {
    let queueUpdate = objectQueue.filter((item: any) => item.type === "update");
    console.log("queueUpdate", queueUpdate);

    if (queueUpdate.length <= 0) return;
    const getId = queueUpdate.map((itemQ: any) => itemQ.item._id);
    let getDataUpdate = queueUpdate.map((itemData: any) => itemData.item);
    const handleDeleteUpdateMany = await ObjectMessageBackUp.deleteMany({
      _id: { $in: getId },
    }).catch((error) => {
      console.log(error);
    });
    if (!handleDeleteUpdateMany?.acknowledged) return;
    const handleInsertUpdateMany = await ObjectMessageBackUp.insertMany(
      getDataUpdate,
      {
        rawResult: true,
        ordered: false,
      }
    ).catch(async (error) => {
      console.log("Duplicate key", error);
    });
    if (!handleInsertUpdateMany) {
      const recordBackUp = await ObjectMessageBackUp.find({
        _id: { $in: getId },
      });
      // lọc id lỗi
      const idDiff = getId.filter(
        (item: any) =>
          !recordBackUp.find(
            (doc) => doc._id.toString() === item._id.toString()
          )
      );
      // hiển thị bản ghi lỗi
      const filterRecordError = getDataUpdate.filter((item: any) =>
        idDiff.find(
          (itemId: any) => itemId._id.toString() === item._id.toString()
        )
      );
      console.log("filterRecordError", filterRecordError);
    }
    console.log("updateManyMessage success!", handleInsertUpdateMany);
    res.send("updateManyMessage Success!");
  }
}

async function deleteManyMessage(req: Request, res: Response) {
  if (objectQueue.length > 0) {
    let queueDelete = objectQueue.filter((item: any) => item.type === "delete");
    console.log("queueDelete", queueDelete);
    if (queueDelete.length <= 0) return;
    const getId = queueDelete.map((itemData: any) => itemData.item._id);
    const handleDeleteMany = await ObjectMessageBackUp.deleteMany(
      {
        _id: { $in: getId },
      },
      { translateAliases: true }
    ).catch((error) => {
      console.log(error);
    });
    if (!handleDeleteMany?.acknowledged) return;
    console.log("deletesMessage success !", handleDeleteMany);
    res.send("deletesMessage Success!");
  }
}

async function runAuto(req: Request, res: Response) {
  loop10s();
}

export {
  getMessageOriginal,
  getMessageBackUp,
  addMessageOriginal,
  editMessageOriginal,
  deleteMessageOriginal,
  editMessageBackUp,
  deleteMessageBackUp,
  addManyMessage,
  updateManyMessage,
  deleteManyMessage,
  runAuto,
};
