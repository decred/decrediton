import { format } from "util";

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
  res.setDate(res.getDate()+1);
  return res;
}

// formatLocalISODate formats the given Date object d in an ISO8601 format, using
// the local timezone (instead of UTC as d.ToISOString())
export function formatLocalISODate(d) {
  const pad = (s, n) => {
    n = n || 2;
    s = Array(n).join("0") + s;
    return s.substring(s.length - n);
  };

  let tzOffset =  d.getTimezoneOffset();
  let tzOffsetSign = "-";
  if (tzOffset < 0) {
    tzOffset = -tzOffset;
    tzOffsetSign = "+";
  }
  let tzOffsetHours = Math.trunc(tzOffset / 60);
  let tzOffsetMinutes = Math.trunc(tzOffset % 60);

  return format("%s-%s-%sT%s:%s:%s.%s%s%s%s",
    d.getFullYear(), pad(d.getMonth()+1, 2), pad(d.getDate(), 2),
    pad(d.getHours(), 2), pad(d.getMinutes(), 2),
    pad(d.getSeconds(), 2), pad(d.getMilliseconds(), 3),
    tzOffsetSign, pad(tzOffsetHours, 2), pad(tzOffsetMinutes, 2));
}

// calculate the difference between two timestamps and return an int
// represent number of days
export function diffBetweenTwoTs(date1, date2) {
  const oneDay = 24*60*60*1000;
  const firstDate = tsToDate(date1);
  const secondDate = tsToDate(date2);
  return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
}
