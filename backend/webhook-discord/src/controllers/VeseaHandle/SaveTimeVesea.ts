import TimeListings from "../../models/VeseaModels/TimeListings";
import TimeOffers from "../../models/VeseaModels/TimeOffers";

async function getTimesVesea(typeTime: "listings" | "offers") {
  if (typeTime == "listings") {
    return shareGet(TimeListings);
  } else if ("offers") {
    return shareGet(TimeOffers);
  }
}

async function addAndUpdateTimeVesea(
  blockTime: number,
  typeTime: "listings" | "offers"
) {
  if (typeTime == "listings") {
    shareAddAndUpdate(TimeListings, blockTime);
  } else if (typeTime == "offers") {
    shareAddAndUpdate(TimeOffers, blockTime);
  }
}

async function shareGet(paramGet: any): Promise<number | undefined> {
  const dataTime = await paramGet.findOne({}).catch(() => {});
  if (!dataTime) return;
  return dataTime.times;
}

async function shareAddAndUpdate(paramsAdd: any, timestamp: number) {
  const resultFind: any = await paramsAdd.findOne({}).catch(() => {});
  if (resultFind) {
    resultFind.items = timestamp;
    resultFind.save().catch(() => {});
    console.log("updateTimeVesea success !");
  } else {
    const bodyTime = new paramsAdd({ times: timestamp });
    const saveDataVesea = await bodyTime.save().catch(() => {});
    console.log("saveDataVesea", saveDataVesea);
  }
}
export { getTimesVesea, addAndUpdateTimeVesea };
