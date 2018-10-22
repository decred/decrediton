import tzmock from "timezone-mock";
import { dateToLocal } from "helpers";
import { dateToUTC } from "../../../app/helpers/dateFormat";

afterEach(() => tzmock.unregister());

function localTime(d) {
  return [ d.getFullYear(), d.getMonth()+1, d.getDate(), d.getHours(),
    d.getMinutes(), d.getSeconds(), d.getMilliseconds() ];
}

test("dateToLocal works as expected", () => {
  tzmock.register("UTC");

  expect(localTime(dateToLocal(0))).toEqual([ 1970, 1, 1, 0, 0, 0, 0 ]);
  expect(localTime(dateToLocal(1539980438))).toEqual([ 2018, 10, 19, 20, 20, 38, 0 ]);
  expect(localTime(dateToLocal(1541708438))).toEqual([ 2018, 11, 8, 20, 20, 38, 0 ]);

  tzmock.register("Brazil/East");

  expect(localTime(dateToLocal(0))).toEqual([ 1969, 12, 31, 21, 0, 0, 0 ]);
  expect(localTime(dateToLocal(1539980438))).toEqual([ 2018, 10, 19, 17, 20, 38, 0 ]);
  expect(localTime(dateToLocal(1541708438))).toEqual([ 2018, 11, 8, 18, 20, 38, 0 ]); // DST on

  tzmock.register("US/Pacific");

  expect(localTime(dateToLocal(0))).toEqual([ 1969, 12, 31, 16, 0, 0, 0 ]);
  expect(localTime(dateToLocal(1539980438))).toEqual([ 2018, 10, 19, 13, 20, 38, 0 ]); // DST on
  expect(localTime(dateToLocal(1541708438))).toEqual([ 2018, 11, 8, 12, 20, 38, 0 ]);

});

test("dateToUtc works as expected", () => {
  tzmock.register("UTC");

  expect(localTime(dateToUTC(0))).toEqual([ 1970, 1, 1, 0, 0, 0, 0 ]);
  expect(localTime(dateToUTC(1539980438))).toEqual([ 2018, 10, 19, 20, 20, 38, 0 ]);
  expect(localTime(dateToUTC(1541708438))).toEqual([ 2018, 11, 8, 20, 20, 38, 0 ]);

  tzmock.register("Brazil/East");

  expect(localTime(dateToUTC(0))).toEqual([ 1970, 1, 1, 0, 0, 0, 0 ]);
  expect(localTime(dateToUTC(1539980438))).toEqual([ 2018, 10, 19, 20, 20, 38, 0 ]);
  expect(localTime(dateToUTC(1541708438))).toEqual([ 2018, 11, 8, 20, 20, 38, 0 ]);

  tzmock.register("US/Pacific");

  expect(localTime(dateToUTC(0))).toEqual([ 1970, 1, 1, 0, 0, 0, 0 ]);
  expect(localTime(dateToUTC(1539980438))).toEqual([ 2018, 10, 19, 20, 20, 38, 0 ]);
  expect(localTime(dateToUTC(1541708438))).toEqual([ 2018, 11, 8, 20, 20, 38, 0 ]);

});
