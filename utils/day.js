const getDayOfWeek = () => {
  const today = new Date();
  const day = today.getDay();

  return day + 1;
};

module.exports = getDayOfWeek;
