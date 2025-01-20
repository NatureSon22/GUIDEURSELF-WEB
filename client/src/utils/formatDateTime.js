const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  const formatted = `${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")}-${date
    .getFullYear()
    .toString()
    .slice(-2)} ${date.getHours() % 12 || 12}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${date.getHours() >= 12 ? "PM" : "AM"}`;

  return formatted;
};

export default formatDateTime;
