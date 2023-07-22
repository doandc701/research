import reNormalCountTo from "./src/normal";
import reboundCountTo from "./src/rebound";
import { withInstall } from "@pureadmin/utils";

/** Common Digital Animation Components */
const ReNormalCountTo = withInstall(reNormalCountTo);

/** Rebound Digital Animation Components */
const ReboundCountTo = withInstall(reboundCountTo);

export { ReNormalCountTo, ReboundCountTo };
