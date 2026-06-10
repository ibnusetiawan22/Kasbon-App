export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const sum = (values: readonly number[]): number => {
  return values.reduce((total, current) => total + current, 0);
};

export const roundTo = (value: number, fractionDigits = 2): number => {
  const factor = 10 ** fractionDigits;
  return Math.round(value * factor) / factor;
};
