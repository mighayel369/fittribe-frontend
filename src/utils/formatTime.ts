export const formatTime = (minutes: number) => {
  if (minutes === undefined || minutes === null) return "--:--";

  const totalMinutes = Number(minutes);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = mins < 10 ? `0${mins}` : mins;

  return `${displayHours}:${displayMinutes} ${ampm}`;
};

export const formatDate = (isoString: string | undefined): string => {
  if (!isoString || isoString === "N/A") return "N/A";

  const date = new Date(isoString);


  return date.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};