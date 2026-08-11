/** Nexo stores decimal amounts and rounds at every financial boundary to cents. */
export const roundMoney = (value: number): number => {
  if (!Number.isFinite(value)) throw new Error("Invalid monetary value");
  return Math.round((value + Number.EPSILON) * 100) / 100;
};
export const sumMoney = (values: number[]) => values.reduce((sum, value) => roundMoney(sum + value), 0);
export const isPositiveMoney = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value > 0;
