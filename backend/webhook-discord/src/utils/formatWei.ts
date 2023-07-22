import BigNumber from "bignumber.js";

export function fromWeiFormat(
  val: string,
  decimals = 18,
  precision = 6
): string {
  const bn = new BigNumber(val);
  return bn.dividedBy(`1e${decimals}`).precision(precision).toFormat(); // toFormat(this.format)
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

export function fromWei(val: string, decimals = 18): string {
  return new BigNumber(val)
    .div(`1e${decimals}`)
    .toFixed(18, 1)
    .replace(/0/g, " ")
    .trimEnd()
    .replace(/ /g, "0");
}

export function toWei(val: string | number, decimals = 18, max = 20): string {
  return new BigNumber(formatFloatNumber(val, decimals, max))
    .multipliedBy(`1e${decimals}`)
    .toString(10);
}
