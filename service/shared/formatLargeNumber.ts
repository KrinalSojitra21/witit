type Props = {
  value: number;
};

export const formatLargeNumber = (value: number) => {
  if (value >= 1000000000) {
    let result = value / 1000000000;
    return result.toFixed(result % 1 === 0 ? 0 : 1) + "B+";
  } else if (value >= 1000000) {
    let result = value / 1000000;
    return result.toFixed(result % 1 === 0 ? 0 : 1) + "M+";
  } else if (value >= 1000) {
    let result = value / 1000;
    return result.toFixed(result % 1 === 0 ? 0 : 1) + "k+";
  } else if (value >= 100) {
    return value.toString();
  } else if (value >= 10) {
    return value.toString();
  }
  return value.toString();
};
