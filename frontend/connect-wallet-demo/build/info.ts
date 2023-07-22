import type { Plugin } from "vite";
import dayjs, { Dayjs } from "dayjs";
import duration from "dayjs/plugin/duration";
import { green, bold } from "picocolors";
import { getPackageSize } from "@pureadmin/utils";
dayjs.extend(duration);

export function viteBuildInfo(): Plugin {
  let config: { command: string };
  let startTime: Dayjs;
  let endTime: Dayjs;
  return {
    name: "vite:buildInfo",
    configResolved(resolvedConfig: { command: string }) {
      config = resolvedConfig;
    },
    buildStart() {
      if (config.command === "build") {
        startTime = dayjs(new Date());
      }
    },
    closeBundle() {
      if (config.command === "build") {
        endTime = dayjs(new Date());
        getPackageSize({
          callback: (size: string) => {
            console.log(
              bold(
                green(
                  `🎉 Congratulations on the completion of the packaging (total time ${dayjs
                    .duration(endTime.diff(startTime))
                    .format("mm分ss秒")}，The packed size is ${size}）`
                )
              )
            );
          }
        });
      }
    }
  };
}
