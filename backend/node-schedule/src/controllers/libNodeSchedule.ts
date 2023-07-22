// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 6) ==> ( 0: Chủ nhật, 1: thứ hai, 2: thứ ba, 3: thứ tư, 4: thứ 5, 5: thứ sáu, 6: thứ bảy )
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

import { Object5s } from "../models/NodeSchedule/5sLoop";
import { Object10s } from "../models/NodeSchedule/10sNoLoop";
import { ObjectHoursEveryDay } from "../models/NodeSchedule/HoursEveryDay";

const schedule = require("node-schedule");

const objAccoding = [
  {
    name: "Nodejs",
  },
  {
    name: "VuejS",
  },
  {
    name: "Reactjs",
  },
  {
    name: "Angular",
  },
];

const loop5s = schedule.scheduleJob("*/5 * * * * *", async function () {
  console.log("giay thu 5 chay 1 lan");

  const result = new Object5s({ data: objAccoding });
  await result
    .save()
    .then((docs) => {
      // console.log(docs);
      return;
    })
    .catch((error) => {
      console.log(error);
    });
});

// thời gian được thực thi trong khoảng thời gian cả tuần
const specialTime = new schedule.RecurrenceRule();
specialTime.dayOfWeek = [0, new schedule.Range(1, 6)]; //day of week (0 - 6)
specialTime.hour = 16;
specialTime.minute = 46;
const everyDay = schedule.scheduleJob(specialTime, async function () {
  console.log("Chi chay 1 lan trong ngay va lap lai trong tuan");

  const result = new ObjectHoursEveryDay({ data3: objAccoding });
  await result
    .save()
    .then((docs) => {
      // console.log(docs);
      return;
    })
    .catch((error) => {
      console.log(error);
    });
});

// chạy trong khoảng thời gian hiện tại và 1 lần duy nhất
const startTime = new Date(Date.now() + 5000);
const endTime = new Date(startTime.getTime() + 10000);
export const run10send = schedule.scheduleJob(
  { start: startTime, end: endTime, rule: "*/10 * * * * *" },
  async function () {
    console.log("giay thu 10 chay 1 lan duy nhat");

    const result = new Object10s({ data2: objAccoding });
    await result
      .save()
      .then((docs) => {
        // console.log(docs);
        return;
      })
      .catch((error) => {
        console.log(error);
      });
  }
);
