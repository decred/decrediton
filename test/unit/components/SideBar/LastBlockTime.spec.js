import { LastBlockTime } from "SideBar/MenuBottom/LastBlockTime/LastBlockTime";
import { advanceBy, clear } from "jest-date-mock";
import { screen, waitFor } from "@testing-library/react";
import { render } from "test-utils.js";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";

afterEach(() => {
  clear();
  jest.useRealTimers();
});

test("Recent mined block time displays correctly", () => {
  const now = new Date().getTime() / 1000 - 1;
  render(
    <LastBlockTime
      lastBlockTimestamp={now}
      setTimeout={() => {}}
      clearTimeout={() => {}}
    />
  );

  expect(screen.getByText("seconds ago")).toBeInTheDocument();
});

test("Old mined block time displays correctly", () => {
  const now = new Date().getTime() / 1000 - 86400;
  render(
    <LastBlockTime
      lastBlockTimestamp={now}
      setTimeout={() => {}}
      clearTimeout={() => {}}
    />
  );

  expect(screen.getByText("yesterday")).toBeInTheDocument();
});

test("Block time updates after a minute", async () => {
  const now = new Date().getTime() / 1000;
  jest.useFakeTimers();

  const { getByText, queryByText } = render(
    <LastBlockTime
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

  await waitFor(() =>
    expect(queryByText("seconds ago")).not.toBeInTheDocument()
  );
  await waitFor(() => expect(queryByText("1 minute ago")).toBeInTheDocument());
});

test("Empty timestamp returns null", () => {
  const { container } = render(
    <LastBlockTime
      lastBlockTimestamp={null}
      setTimeout={() => {}}
      clearTimeout={() => {}}
    />
  );

  expect(container.textContent).toBe("");
});
