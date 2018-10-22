import { LastBlockTime } from "SideBar/LastBlockTime";
import { shallow } from "enzyme";
import { advanceBy, advanceTo, clear } from "jest-date-mock";

afterEach(() => clear());

test("Recent mined block time displays correctly", () => {
  const now = (new Date().getTime() / 1000) - 1;
  const lbt = shallow(
    <LastBlockTime lastBlockTimestamp={now} setTimeout={() => {}} clearTimeout={() => {}} />
  );

  expect(lbt.prop("defaultMessage")).toBe("< 1 minute ago");
});

test("Old mined block time displays correctly", () => {
  const now = (new Date().getTime() / 1000) - 86400;
  const lbt = shallow(
    <LastBlockTime lastBlockTimestamp={now} setTimeout={() => {}} clearTimeout={() => {}} />
  );

  const targetDate = new Date(now*1000);
  expect(lbt.prop("value")).toEqual(targetDate);
});

test("Block time updates after a minute", () => {

  let callback;

  const testTime = 1539980438;

  // mock as if this was the current new Date()
  advanceTo(testTime*1000);

  const lbt = shallow(
    <LastBlockTime lastBlockTimestamp={testTime} setTimeout={(cb) => callback = cb} clearTimeout={() => {}} />
  );

  // when the block has just been generated, shows the default message
  expect(lbt.prop("defaultMessage")).toBe("< 1 minute ago");

  // simulate that 61 seconds have passed and re-render component
  advanceBy(61*1000);
  callback();
  lbt.update();

  // check that we now have a <FormattedRelative value={blockDate} />
  const targetDate = new Date(testTime*1000);
  expect(lbt.prop("value")).toEqual(targetDate);

});

test("Empty timestamp returns null", () => {
  const lbt = shallow(
    <LastBlockTime lastBlockTimestamp={null} setTimeout={() => {}} clearTimeout={() => {}} />
  );

  expect(lbt.getElement()).toBeNull();
});
