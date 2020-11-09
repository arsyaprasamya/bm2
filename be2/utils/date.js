module.exports = {
  firstDay: function () {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    return new Date(y, m, 1);
  },
  lastDay: function () {
    var date = new Date(), y = date.getFullYear(), m = date.getMonth();
    return new Date(y, m + 1, 1);
  }
}
