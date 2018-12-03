import { format } from "util";

// dateToLocal converts the specified unix timestamp (possibly a block or
// transaction timestamp) from seconds to a JS Date object.
export function dateToLocal(timestamp) {
  return new Date(timestamp * 1000);
}

// dateToUTC converts the specified unix timestamp (possibly a block or
// transaction timestamp) from seconds to a JS Date object in such a way that,
// when formatted using the local timezone, the actual time displayed is the UTC
// equivalent of the timestamp.
// This function is slightly cheating, because javascript Date objects do *not*
// have an internal timezone; they are always internally stored as unix
// timestamps and formatted using the local timezone with no way to change the
// timezone offset they use.
// While this particular trick works for UTC, it's not great, and not easily
// generalizable to using multiple timezones. If in the future we want to add
// the ability to use timezones other than UTC and local, we should really
// start using a decent library like momentjs.
export function dateToUTC(timestamp) {
  const date = new Date(timestamp * 1000);
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
    date.getUTCHours(), date.getUTCMinutes(),  date.getUTCSeconds());
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
export function formatLocalISODate(d, timezone) {
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
  let tz = timezone === "utc" ? "Z" : tzOffsetSign + pad(tzOffsetHours, 2) + pad(tzOffsetMinutes, 2);

  return format("%s-%s-%sT%s:%s:%s.%s%s",
    d.getFullYear(), pad(d.getMonth()+1, 2), pad(d.getDate(), 2),
    pad(d.getHours(), 2), pad(d.getMinutes(), 2),
    pad(d.getSeconds(), 2), pad(d.getMilliseconds(), 3),
    tz);
}

// calculate the difference between two timestamps and return an int
// represent number of days
export function diffBetweenTwoTs(date1, date2) {
  const oneDay = 24*60*60*1000;
  const firstDate = dateToLocal(date1);
  const secondDate = dateToLocal(date2);
  return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
}

// isSameDate receives two dates and return true if they are the same
// day/month/yeah, false otherwise.
export function isSameDate(d1,d2) {
  if (
    (!d1) || (!d2) ||
      (d1.getYear() !== d2.getYear()) ||
      (d1.getMonth() !== d2.getMonth()) ||
      (d1.getDate() !== d2.getDate())
  ) {
    return false;
  }
  return true;
}
