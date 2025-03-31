const formatDate = (date) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "Invalid Date";

  return `${parsedDate.getDate().toString().padStart(2, "0")}-${(parsedDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${parsedDate.getFullYear()}`;
};

export default formatDate;
