// utils/date.ts
export const formatToDubai12Hour = (utcDateString) => {
  if (!utcDateString) return "-";

  const date = new Date(utcDateString);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "Asia/Dubai", 
  };

  return date.toLocaleString("en-US", options);
};
