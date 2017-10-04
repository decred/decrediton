// tsToDate converts a transaction timestamp into a date
// object
export function tsToDate(txTimestamp) {
  return new Date(txTimestamp*1000);
}
