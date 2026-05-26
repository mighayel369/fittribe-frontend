export const generateTimes = () => {
  const times: number[] = [];
  let minutes = 0;

  while (minutes < 24 * 60) {
    times.push(minutes)
    minutes+=30
  }

  return times;
};


