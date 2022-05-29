/* istanbul ignore file */
export const startTimer = () => new Date();

export const stopTimer = (startTime: Date) => {
  let endTime = new Date();
  let diff = endTime.getTime() - startTime.getTime();
  return diff;
};