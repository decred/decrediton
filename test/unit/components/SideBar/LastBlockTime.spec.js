import { LastBlockTime } from "SideBar/MenuBottom/LastBlockTime/LastBlockTime";
import { mount } from "enzyme";
import { advanceBy, clear } from "jest-date-mock";
import { IntlProvider, FormattedMessage } from "react-intl";
import { FormattedRelative } from "shared";
import { en as enLocale, defaultFormats } from "../../../../app/i18n/locales";
import { render, wait } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";

afterEach(() => {
  clear();
  jest.useRealTimers();
});

// en
const locale = enLocale;

const Wrapper = ({ lastBlockTimestamp, setTimeout, clearTimeout }) => {
  return (
    <IntlProvider
      locale={locale.language}
      messages={locale.messages}
      formats={locale.formats}
      defaultFormats={defaultFormats}
      key={locale.key}>
      <LastBlockTime
        lastBlockTimestamp={lastBlockTimestamp}
        setTimeout={setTimeout}
        clearTimeout={clearTimeout}
      />
    </IntlProvider>
  );
};

test("Recent mined block time displays correctly", () => {
  const now = new Date().getTime() / 1000 - 1;
  const lbt = mount(
    <Wrapper
      lastBlockTimestamp={now}
      setTimeout={() => {}}
      clearTimeout={() => {}}
    />
  );

  expect(
    lbt.find(LastBlockTime).find(FormattedMessage).prop("defaultMessage")
  ).toBe("seconds ago");
});

test("Old mined block time displays correctly", () => {
  const now = new Date().getTime() / 1000 - 86400;
  const lbt = mount(
    <Wrapper
      lastBlockTimestamp={now}
      setTimeout={() => {}}
      clearTimeout={() => {}}
    />
  );

  const targetDate = new Date(now * 1000);
  expect(lbt.find(LastBlockTime).find(FormattedRelative).prop("value")).toEqual(
    targetDate
  );
});

test("Block time updates after a minute", async () => {
  const now = new Date().getTime() / 1000;
  jest.useFakeTimers();

  const { getByText, queryByText } = render(
    <Wrapper
      lastBlockTimestamp={now}
      setTimeout={setTimeout}
      clearTimeout={() => {}}
    />
  );

  // when the block has just been generated, shows the default message
  expect(getByText("seconds ago")).toBeInTheDocument();
  // simulate that 61 seconds have passed
  act(() => {
    advanceBy(61 * 1000);
    jest.advanceTimersByTime(61 * 1000);
  });

  await wait(() => expect(queryByText("seconds ago")).not.toBeInTheDocument());
  await wait(() => expect(queryByText("1 minute ago")).toBeInTheDocument());
});

test("Empty timestamp returns null", () => {
  const lbt = mount(
    <Wrapper
      lastBlockTimestamp={null}
      setTimeout={() => {}}
      clearTimeout={() => {}}
    />
  );

  expect(lbt.find(LastBlockTime).children().exists()).toEqual(false);
});
