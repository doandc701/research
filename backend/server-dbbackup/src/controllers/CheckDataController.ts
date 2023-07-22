import { NextFunction, Request, Response } from "express";
import { ObjectMessage, ObjectMessageBackUp } from "../models/message";
import { removeSchedule } from "../services/scheduleJobs";

const limitPage = 5;
async function backupData(req: Request, res: Response, next: NextFunction) {
  const handleDeleteBackUp = await ObjectMessageBackUp.findByIdAndDelete({
    _id: req.params.id,
  }).catch((error) => {
    console.log(error);
  });
  if (handleDeleteBackUp) console.log("handleDeleteBackUp", handleDeleteBackUp);
  const handleInsertManyBackUp = await ObjectMessageBackUp.insertMany(
    req.body,
    { rawResult: true }
  ).catch((error) => {
    // console.log(error);
    res.json(...error.writeErrors);
  });
  if (
    handleInsertManyBackUp?.acknowledged &&
    handleInsertManyBackUp?.insertedCount > 0
  ) {
    res.json(handleInsertManyBackUp);
    console.log("backup success!", handleInsertManyBackUp);
  } else {
    console.log("backup that bai");
  }
}

async function restoreData(req: Request, res: Response) {
  const handleDeleteRestore = await ObjectMessage.findByIdAndDelete({
    _id: req.params.id,
  }).catch((error) => {
    console.log(error);
  });
  if (handleDeleteRestore) {
    console.log("handleDeleteRestore", handleDeleteRestore);
  }

  const handleInsertManyRestore = await ObjectMessage.insertMany(req.body, {
    rawResult: true,
  }).catch((error) => {
    console.log(error);
    res.json(...error.writeErrors);
  });
  if (
    handleInsertManyRestore?.acknowledged &&
    handleInsertManyRestore?.insertedCount > 0
  ) {
    res.json(handleInsertManyRestore);
    console.log("Restore Success!", handleInsertManyRestore);
  } else {
    console.log("Restore that bai");
  }
}

async function deleteRecordBackUp(req: Request, res: Response) {
  // console.log("req.params.id", req.params.id);
  await ObjectMessage.findByIdAndDelete(req.params.id)
    .then((deleted: any) => {
      console.log("deleteRecordBackUp success !");
      res.json(deleted);
    })
    .catch((error: any) => {
      console.log(error);
      res.json(...error.writeErrors);
    });
}
async function deleteRecordRestore(req: Request, res: Response) {
  await ObjectMessageBackUp.findByIdAndDelete(req.params.id)
    .then((deleted: any) => {
      console.log("deleteRecordRestore success !");
      res.json(deleted);
    })
    .catch((error: any) => {
      console.log(error);
      res.json(...error.writeErrors);
    });
}

// count
async function countRecordBackUp() {
  const countDocMess = await ObjectMessage.countDocuments({});
  const lastBackUpDoc = await ObjectMessageBackUp.findOne().sort({
    updatedAt: -1,
  });
  if (lastBackUpDoc) {
    const countDocBackUp = await ObjectMessage.count({
      updatedAt: { $gt: lastBackUpDoc.updatedAt },
    });
    // console.log("countDocBackUp", countDocBackUp);
    return { countDocMess, countDocBackUp };
  }
}
async function countRecordRestore() {
  const countDocMessBackUp = await ObjectMessageBackUp.countDocuments({});
  const lastOriginalDoc = await ObjectMessage.findOne().sort({
    updatedAt: -1,
  });
  if (lastOriginalDoc) {
    const countDocRestore = await ObjectMessageBackUp.count({
      updatedAt: { $gt: lastOriginalDoc.updatedAt },
    });
    // console.log("countDocRestore111111", countDocRestore);
    return { countDocMessBackUp, countDocRestore };
  }
}
async function checkRecordBackUp(req: Request, res: Response) {
  let result1: any[] = [];
  let perPage = limitPage;
  let page = Number(req.query.page) || 1;
  let skip = perPage * page - perPage;
  let arr1 = [];
  const recordBack = await countRecordBackUp();
  const dataOriginal = await ObjectMessage.find()
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(perPage);
  for (let i in dataOriginal) arr1.push(dataOriginal[i]._id);
  const lastBackUpDoc = await ObjectMessageBackUp.find({
    _id: { $in: arr1 },
  });
  if (lastBackUpDoc) {
    for (let i in lastBackUpDoc) {
      const dBackUp = lastBackUpDoc.find(
        (item) => item._id.toString() === dataOriginal[i]._id.toString()
      );
      if (dBackUp) {
        const millisecondsBackUp = new Date(dBackUp.updatedAt).getTime();
        const millisecondsOriginal = new Date(
          dataOriginal[i].updatedAt
        ).getTime();
        if (millisecondsBackUp !== millisecondsOriginal) {
          if (millisecondsBackUp < millisecondsOriginal) {
            result1.push({
              type: "backup-update",
              items: dataOriginal[i],
            });
          }
        }
      } else {
        result1.push({
          type: "backup-new",
          items: dataOriginal[i],
        });
      }
    }
  }
  res.json({
    result1,
    recordBack,
    page,
    pages: Math.ceil(recordBack?.countDocMess! / perPage),
  });
}

async function checkRecordRestore(req: Request, res: Response) {
  let result2: any[] = [];
  let perPage = limitPage;
  let page = Number(req.query.page) || 1;
  let skip = perPage * page - perPage;
  let arr2 = [];
  const recordRestore = await countRecordRestore();
  const dataBackUp = await ObjectMessageBackUp.find()
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(perPage);
  for (let i in dataBackUp) arr2.push(dataBackUp[i]._id);
  const lastRestore = await ObjectMessage.find({
    _id: { $in: arr2 },
  });
  if (lastRestore) {
    for (let i in dataBackUp) {
      const dOriginal = lastRestore.find(
        (item) => item._id.toString() === dataBackUp[i]._id.toString()
      );
      if (dOriginal) {
        const millisecondsOriginal = new Date(dOriginal.updatedAt).getTime();
        const millisecondsBackUp = new Date(dataBackUp[i].updatedAt).getTime();
        if (millisecondsBackUp !== millisecondsOriginal) {
          if (millisecondsBackUp > millisecondsOriginal) {
            result2.push({
              type: "restore-update",
              items: dataBackUp[i],
            });
          }
        }
      } else {
        console.log("can backup mat data", dataBackUp[i]._id);
        result2.push({
          type: "restore-new",
          items: dataBackUp[i],
        });
      }
    }
  }
  res.json({
    result2,
    recordRestore,
    page,
    pages: Math.ceil(recordRestore?.countDocMessBackUp! / perPage),
  });
}

async function checkStartServer() {
  let result1: any[] = [];
  let arr1 = [];
  let result2: any[] = [];
  let arr2 = [];
  // check original
  const dataOriginal = await ObjectMessage.find().sort({ updatedAt: -1 });
  for (let i in dataOriginal) arr1.push(dataOriginal[i]._id);
  const lastBackUpDoc = await ObjectMessageBackUp.find({
    _id: { $in: arr1 },
  });
  if (lastBackUpDoc) {
    for (let i in lastBackUpDoc) {
      const dBackUp = lastBackUpDoc.find(
        (item) => item._id.toString() === dataOriginal[i]._id.toString()
      );
      if (dBackUp) {
        const millisecondsBackUp = new Date(dBackUp.updatedAt).getTime();
        const millisecondsOriginal = new Date(
          dataOriginal[i].updatedAt
        ).getTime();
        if (millisecondsBackUp !== millisecondsOriginal) {
          if (millisecondsBackUp < millisecondsOriginal) {
            result1.push({
              type: "backup-update",
              items: dataOriginal[i],
            });
          }
        }
      } else {
        result1.push({
          type: "backup-new",
          items: dataOriginal[i],
        });
      }
    }
  }

  // check backup
  const dataBackUp = await ObjectMessageBackUp.find().sort({ updatedAt: -1 });
  for (let i in dataBackUp) arr2.push(dataBackUp[i]._id);
  const lastRestore = await ObjectMessage.find({
    _id: { $in: arr2 },
  });
  if (lastRestore) {
    for (let i in dataBackUp) {
      const dOriginal = lastRestore.find(
        (item) => item._id.toString() === dataBackUp[i]._id.toString()
      );
      if (dOriginal) {
        const millisecondsOriginal = new Date(dOriginal.updatedAt).getTime();
        const millisecondsBackUp = new Date(dataBackUp[i].updatedAt).getTime();
        if (millisecondsBackUp !== millisecondsOriginal) {
          if (millisecondsBackUp > millisecondsOriginal) {
            result2.push({
              type: "restore-update",
              items: dataBackUp[i],
            });
          }
        }
      } else {
        console.log("can backup mat data", dataBackUp[i]._id);
        result2.push({
          type: "restore-new",
          items: dataBackUp[i],
        });
      }
    }
  }
  if (result1.length > 0 || result2.length > 0) removeSchedule();
}
export {
  checkStartServer,
  backupData,
  restoreData,
  checkRecordBackUp,
  checkRecordRestore,
  deleteRecordBackUp,
  deleteRecordRestore,
};
