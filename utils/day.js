const getDayOfWeek = () => {
  const today = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const currentDay = days[today.getDay()];
  return currentDay;
};

module.exports = getDayOfWeek;
