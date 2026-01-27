const NANO_FACTOR = 1_000_000_000n;

const formatIntegerString = (value: string) => {
  const normalized = value.replace(/^0+(?=\d)/, "");
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const nanoToTonString = (nano: string | bigint): string => {
  const value = typeof nano === "bigint" ? nano : BigInt(nano);
  const isNegative = value < 0n;
  const absValue = isNegative ? -value : value;
  const whole = absValue / NANO_FACTOR;
  const fraction = absValue % NANO_FACTOR;
  const fractionString = fraction.toString().padStart(9, "0").replace(/0+$/, "");
  const result = fractionString
    ? `${whole.toString()}.${fractionString}`
    : whole.toString();
  return isNegative ? `-${result}` : result;
};

export const formatTonString = (value: string): string => {
  const [whole, fraction] = value.split(".");
  const formattedWhole = formatIntegerString(whole ?? "0");
  return fraction ? `${formattedWhole}.${fraction}` : formattedWhole;
};
