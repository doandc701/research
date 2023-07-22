import numbro from "numbro";

// using a currency library here in case we want to add more in future
export const formatDollarAmount = (
  num: number | undefined,
  digits = 2,
  round = true
) => {
  // console.log("num", num);
  if (num === 0) {
    // console.log("$ 0.00");
    return "$0.00";
  }
  if (!num) {
    // console.log("-");
    return "-";
  }
  if (num < 0.001 && digits <= 3) {
    // console.log("<$0.001");
    return "<$0.001";
  }
  const result = numbro(num).formatCurrency({
    average: round,
    mantissa: num > 1000 ? 2 : digits,
    abbreviations: {
      million: "M",
      billion: "B"
    }
  });
  // console.log("result", result);
  return result;
};

// using a currency library here in case we want to add more in future
export const formatAmount = (num: number | undefined, digits = 2) => {
  if (num === 0) {
    // console.log("formatAmount");
    return "0";
  }
  if (!num) {
    // console.log("-");
    return "-";
  }
  if (num < 0.001) {
    // console.log("<$0.001");
    return "<0.001";
  }
  const resultAmount = numbro(num).format({
    average: true,
    mantissa: num > 1000 ? 2 : digits,
    abbreviations: {
      million: "M",
      billion: "B"
    }
  });
  // console.log("resultAmount", resultAmount);
  return resultAmount;
};
