export const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const getCleanTime = (mongoTimestamp) => {
  const date = new Date(mongoTimestamp);
  return date.toLocaleString("en-US", {
    // day: "2-digit",
    // month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getCleanDay = (mongoTimestamp) => {
  const date = new Date(mongoTimestamp);
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    // hour: "2-digit",
    // minute: "2-digit",
    // hour12: true,
  });
};
