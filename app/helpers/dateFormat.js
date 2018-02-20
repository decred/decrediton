// tsToDate converts a transaction timestamp into a date
// object
export function tsToDate(txTimestamp) {
  return new Date(txTimestamp*1000);
}

// endOfDay returns a new date pointing to the end of the day (last second)
// of the day stored in the given date.
export function endOfDay(dt) {
  const res = new Date(dt);
  res.setMilliseconds(0);
  res.setSeconds(0);
  res.setMinutes(0);
  res.setHours(0);
  res.setSeconds(-1);
  return res;
}

// calculate the difference between two timestamps and return an int
// represent number of days
export function diffBetweenTwoTs(date1, date2) {
  const oneDay = 24*60*60*1000;
  const firstDate = tsToDate(date1);
  const secondDate = tsToDate(date2);
  return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
}
