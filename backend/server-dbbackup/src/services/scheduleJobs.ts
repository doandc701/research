import schedule from "node-schedule";
import { ObjectMessageBackUp } from "../models/message";
import { getData } from "../stores/data";
let get100First: any[];
let position = 0;
let elements = 100;
let jobs: schedule.Job;
export const loop10s = () => {
  const job = schedule.scheduleJob(`*/10 * * * * *`, async function () {
    console.log("Start Schedule Success");
    const arrayMessage = getData();
    // console.log("arrayMessage", arrayMessage);
    if (arrayMessage.length <= 0) return;

    // handleAdd --------------------
    let dataInsert = arrayMessage.filter((item: any) => item.type === "insert");
    if (dataInsert.length > 0) {
      get100First = dataInsert.splice(position, elements);
      const mapId = get100First.map((itemQ: any) => itemQ.item._id);
      let mapData = get100First.map((itemData: any) => itemData.item);
      // console.log("mapId", mapId);
      // console.log("mapData", mapData);
      const handleDeleteAddMany = await ObjectMessageBackUp.deleteMany({
        _id: { $in: mapId },
      }).catch((error) => {
        console.log("error-----lllll", error);
      });
      if (!handleDeleteAddMany?.acknowledged) return;
      console.log("handleDeleteAddMany", handleDeleteAddMany);
      const handleInsertAddMany = await ObjectMessageBackUp.insertMany(
        mapData,
        {
          rawResult: true,
          ordered: false,
        }
      ).catch((error) => {
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
      }
    }

    // handleUpdate --------------------
    let dataUpdate = arrayMessage.filter((item: any) => item.type === "update");
    if (dataUpdate.length > 0) {
      get100First = dataUpdate.splice(position, elements);
      if (get100First.length > 0) {
        const getId = get100First.map((itemQ: any) => itemQ.item._id);
        let getDataUpdate = get100First.map((itemData: any) => itemData.item);
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
      }
    }

    // // handleDelete --------------------
    let dataDelete = arrayMessage.filter((item: any) => item.type === "delete");
    if (dataDelete.length > 0) {
      get100First = dataDelete.splice(position, elements);
      if (get100First.length > 0) {
        const getIdDelete = get100First.map(
          (itemData: any) => itemData.item._id
        );
        const handleDeleteMany = await ObjectMessageBackUp.deleteMany(
          {
            _id: { $in: getIdDelete },
          },
          { translateAliases: true }
        ).catch((error) => {
          console.log(error);
        });
        if (!handleDeleteMany?.acknowledged) return;
        console.log("deletesMessage success !", handleDeleteMany);
      }
    }
  });
  jobs = job;
};

export const removeSchedule = () => {
  if (jobs) {
    jobs.cancel();
    console.log("Remove Schedule Success");
  }
};
