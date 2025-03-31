const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  if (isNaN(date.getTime())) return "Invalid Date";

  const formatted = `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getFullYear()} ${date.getHours() % 12 || 12}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${date.getHours() >= 12 ? "PM" : "AM"}`;

  return formatted;
};

export default formatDateTime;
