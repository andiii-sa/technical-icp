export const formatTime = (timer) => {
  const minutes = Math.floor(timer / 60)
    .toString()
    .padStart(2, "0");
  const hours = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(timer % 60)
    .toString()
    .padStart(2, "0");

  return { hours, minutes, seconds };
};
