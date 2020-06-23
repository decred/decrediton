import { LastBlockTime } from "SideBar/MenuBottom/LastBlockTime/LastBlockTime";
import { mount } from "enzyme";
import { advanceBy, advanceTo, clear } from "jest-date-mock";
import { IntlProvider, FormattedMessage } from "react-intl";
import { FormattedRelative } from "shared";
import locales, { defaultFormats } from "../../../../app/i18n/locales";

afterEach(() => clear());

const locale = locales[1];

const Wrapper = ({ lastBlockTimestamp, setTimeout, clearTimeout }) => {
  return (
    <IntlProvider
      locale={locale.language}
      messages={locale.messages}
      formats={locale.formats}
      defaultFormats={defaultFormats}
      key={locale.key}
    >
      <LastBlockTime lastBlockTimestamp={lastBlockTimestamp} setTimeout={setTimeout} clearTimeout={clearTimeout} />
    </IntlProvider>
  );
};

test("Recent mined block time displays correctly", () => {
  const now = (new Date().getTime() / 1000) - 1;
  const lbt = mount(
    <Wrapper
      lastBlockTimestamp={now} setTimeout={() => { }} clearTimeout={() => { }}
    />
  );

  expect(lbt.find(LastBlockTime).find(FormattedMessage).prop("defaultMessage")).toBe("< 1 minute ago");
});

test("Old mined block time displays correctly", () => {
  const now = (new Date().getTime() / 1000) - 86400;
  const lbt = mount(
    <Wrapper
      lastBlockTimestamp={now} setTimeout={() => { }} clearTimeout={() => { }}
    />
  );

  const targetDate = new Date(now * 1000);
  expect(lbt.find(LastBlockTime).find(FormattedRelative).prop("value")).toEqual(targetDate);
});

test("Block time updates after a minute", () => {

  let callback;

  const testTime = 1539980438;

  // mock as if this was the current new Date()
  advanceTo(testTime * 1000);

  const lbt = mount(
    <Wrapper
      lastBlockTimestamp={testTime} setTimeout={(cb) => callback = cb} clearTimeout={() => { }}
    />
  );

  // when the block has just been generated, shows the default message
  expect(lbt.find(LastBlockTime).find(FormattedMessage).prop("defaultMessage")).toBe("< 1 minute ago");

  // simulate that 61 seconds have passed and re-render component
  advanceBy(61 * 1000);
  callback();
  lbt.update();

  // check that we now have a <FormattedRelative value={blockDate} />
  const targetDate = new Date(testTime * 1000);
  expect(lbt.find(LastBlockTime).find(FormattedRelative).prop("value")).toEqual(targetDate);
});

test("Empty timestamp returns null", () => {
  const lbt = mount(
    <Wrapper
      lastBlockTimestamp={null} setTimeout={() => { }} clearTimeout={() => { }}
    />
  );

  expect(lbt.find(LastBlockTime).children().exists()).toEqual(false);
});
