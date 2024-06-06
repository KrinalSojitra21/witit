export function generateArray(start: number, end: number) {
  const resultArray: number[] = [];

  // Define the ranges and corresponding increments
  const ranges = [
    { start: 10, end: 100, increment: 10 },
    { start: 100, end: 1000, increment: 50 },
    { start: 1000, end: 2000, increment: 100 },
    { start: 2000, end: 5000, increment: 500 },
    { start: 5000, end: 10000, increment: 1000 },
  ];

  // Generate the array based on user-specified start and end values
  ranges.forEach((range) => {
    if (start < range.end && end > range.start) {
      const min = Math.max(start, range.start);
      const max = Math.min(end, range.end);

      for (let i = min; i <= max; i += range.increment) {
        // Check if the value is not already in the resultArray
        if (!resultArray.includes(i)) {
          resultArray.push(i);
        }
      }
    }
  });

  return resultArray;
}
