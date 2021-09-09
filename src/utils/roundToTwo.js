// https://stackoverflow.com/a/11832950
export const roundToTwo = (number) =>
  Math.round((number + Number.EPSILON) * 100) / 100;
