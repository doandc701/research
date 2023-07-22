import VpunksMarketTimes from "../../models/VpunksModels/TimeEvents";

async function getTimes(): Promise<number | undefined> {
  const dataTime = await VpunksMarketTimes.findOne({}).catch(() => {});
  if (!dataTime) return;
  return dataTime.times;
}

async function addAndUpdateTime(blockTime: any): Promise<void> {
  const resultFind: any = await VpunksMarketTimes.findOne({}).catch(() => {});
  if (resultFind) {
    resultFind.times = blockTime;
    resultFind.save().catch(() => {});
    console.log("updateTimeVpunks success !");
  } else {
    const bodyTime = new VpunksMarketTimes({ times: blockTime });
    const saveData = await bodyTime.save().catch(() => {});
    console.log("saveDataVpunks", saveData);
  }
}
export { getTimes, addAndUpdateTime };
