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
