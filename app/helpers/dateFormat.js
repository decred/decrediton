// tsToDate converts a transaction timestamp into a date
// object
export function tsToDate(txTimestamp) {
  return new Date(txTimestamp*1000);
}

// tsToDate converts a transaction timestamp into a date
// string yyyy/mm/dd. mm goes from 0 to 11
export function tsToYYYYMMDD(txTimestamp) {
  let a = new Date(txTimestamp * 1000);
  let year = a.getFullYear();
  let month = a.getMonth();
  var date = a.getDate();
  return year + "/" + month + "/" + date;
}
