import Connex from "@vechain/connex";
import BigNumber from "bignumber.js";

export class Ticker {
  ticker: Connex.Thor.Ticker;
  flag = false;
  constructor(connex: Connex) {
    this.ticker = connex.thor.ticker();
  }

  async tick(cb: () => Promise<void>): Promise<void> {
    for (;;) {
      await cb();
      await this.ticker.next();
      if (this.flag) {
        return;
      }
    }
  }

  stop(): void {
    this.flag = true;
  }
}

export function formatFloatNumber(
  value: string | number,
  decimals = 18,
  max = 20
): string {
  let _value = typeof value === "string" ? value : value.toString(10);
  _value = _value.replace(/[^\d.]/g, ""); // chỉ lấy số và "."
  _value = _value.slice(0, max); // không vượt quá 'max' ký tự tính cả dấu '.'
  const strArr = _value.split(".");
  const dot = strArr.length > 1 ? "." : ""; // loại bỏ dấu . nếu nhiều hơn 1
  return strArr.shift() + dot + strArr.join("").slice(0, decimals); // phần thập phân không dài hơn decimals
}

export function toWei(val: string | number, decimals = 18, max = 20): string {
  return new BigNumber(formatFloatNumber(val, decimals, max))
    .multipliedBy(`1e${decimals}`)
    .toString(10);
}

export function toWei2(val: string | number, decimals = 18): string {
  return new BigNumber(val).multipliedBy(`1e${decimals}`).toString(10);
}

export function toWeiHex(val: string | number, decimals = 18): string {
  return "0x" + new BigNumber(val).multipliedBy(`1e${decimals}`).toString(16);
}

export function fromWei(val: string, decimals = 18): string {
  return new BigNumber(val)
    .div(`1e${decimals}`)
    .toFixed(18, 1)
    .replace(/0/g, " ")
    .trimEnd()
    .replace(/ /g, "0");
}
export function fromWeiFormat(
  val: string,
  decimals = 18,
  precision = 6
): string {
  const bn = new BigNumber(val);
  return bn.dividedBy(`1e${decimals}`).precision(precision).toFormat(); // toFormat(this.format)
}

export class Presume<T> {
  private finished = false;
  promise!: Promise<T>;
  ignore = (): void => {
    this.finished = true;
  };

  constructor(cb: () => Promise<T>) {
    this.promise = new Promise((resolve, reject) => {
      cb()
        .then(resp => {
          resolve(resp);
        })
        .catch(e => {
          reject(e);
        });

      this.ignore = () => {
        if (!this.finished) {
          reject(new Error("abort"));
        }
      };
    });
  }
}

type EstimateGasResult = {
  caller: string;
  gas: number;
  reverted: boolean;
  revertReason: string;
  vmError: string;
  baseGasPrice: string;
};

const paramsGet = {
  constant: true,
  inputs: [{ name: "_key", type: "bytes32" }],
  name: "get",
  outputs: [{ name: "", type: "uint256" }],
  payable: false,
  stateMutability: "view",
  type: "function"
};

async function getBaseGasPrice(thor: Connex.Thor) {
  const baseGasPrice =
    "0x000000000000000000000000000000000000626173652d6761732d7072696365";
  const address = "0x0000000000000000000000000000506172616d73";
  let result = sessionStorage.getItem("bgp");

  if (result) {
    return result;
  } else {
    const temp = await thor
      .account(address)
      .method(paramsGet)
      .cache([address])
      .call(baseGasPrice);
    result = temp.data;
    sessionStorage.setItem("bgp", result);
    return result;
  }
}
function getIntrinsicGas(clauses: Connex.VM.Clause[]) {
  const txGas = 5000;
  const clauseGas = 16000;
  const clauseGasContractCreation = 48000;

  if (clauses.length === 0) {
    return txGas + clauseGas;
  }

  return clauses.reduce((sum, c) => {
    if (c.to) {
      sum += clauseGas;
    } else {
      sum += clauseGasContractCreation;
    }
    if (c.data) sum += dataGas(c.data as string);
    return sum;
  }, txGas);
}

function dataGas(data: string): number {
  const zgas = 4;
  const nzgas = 68;

  let sum = 0;
  for (let i = 2; i < data.length; i += 2) {
    if (data.substr(i, 2) === "00") {
      sum += zgas;
    } else {
      sum += nzgas;
    }
  }
  return sum;
}
export async function estimateGas(
  thor: Connex.Thor,
  clauses: Connex.VM.Clause[],
  suggestedGas: number,
  caller: string,
  gasPayer?: string
): Promise<EstimateGasResult> {
  const intrinsicGas = getIntrinsicGas(
    clauses.map(item => {
      return {
        to: item.to,
        value: item.value || 0,
        data: item.data || "0x"
      };
    })
  );
  const offeredGas = suggestedGas
    ? Math.max(suggestedGas - intrinsicGas, 1)
    : 2000 * 10000;
  const explainer = thor.explain(clauses).caller(caller).gas(offeredGas);

  if (gasPayer) {
    explainer.gasPayer(gasPayer);
  }

  const outputs = await explainer.execute();

  let gas = suggestedGas;
  if (!gas) {
    const execGas = outputs.reduce((sum, out) => sum + out.gasUsed, 0);
    gas = intrinsicGas + (execGas ? execGas + 15000 : 0);
  }

  const bgp = await getBaseGasPrice(thor);
  const lastOutput = outputs.slice().pop();
  return {
    caller,
    gas,
    reverted: lastOutput ? lastOutput.reverted : false,
    revertReason: lastOutput ? lastOutput.revertReason || "" : "",
    vmError: lastOutput ? lastOutput.vmError : "",
    baseGasPrice: bgp
  };
}

export function calcFee(
  gas: number,
  baseGasPrice: string,
  gasPriceCoef: number
): BigNumber {
  return new BigNumber(baseGasPrice)
    .times(gasPriceCoef)
    .idiv(255)
    .plus(baseGasPrice)
    .times(gas);
}

// hexToAscii
export function toAscii(hex) {
  let str = "";
  let i = 0;
  const l = hex.length;
  if (hex.substring(0, 2) === "0x") {
    i = 2;
  }
  for (; i < l; i += 2) {
    const code = parseInt(hex.substr(i, 2), 16);
    if (code !== 0) str += String.fromCharCode(code);
  }

  return str;
}

export function asciiToHex(str) {
  if (!str) return "0x00";
  let hex = "";
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    const n = code.toString(16);
    hex += n.length < 2 ? "0" + n : n;
  }

  return "0x" + hex;
}
