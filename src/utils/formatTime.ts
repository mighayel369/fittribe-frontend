export const formatTime = (minutes: number) => {
  console.log(minutes)
  const date = new Date();
  console.log(date)
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  
  return date.toLocaleTimeString(undefined, { 
    hour: 'numeric', 
    minute: '2-digit', 
    hour12: true 
  });
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