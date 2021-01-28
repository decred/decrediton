import LanguageSelectPage from "components/views/GetStartedPage/LanguageSelectPage/LanguageSelectPage";
import { render } from "test-utils.js";
import { screen } from "@testing-library/react";
import user from "@testing-library/user-event";

import * as sel from "selectors";
import * as da from "actions/DaemonActions";

const testLocalesArray = [
  { description: "first-test-language" },
  { description: "second-test-language" },
  { description: "third-test-language" }
];
let mockSortedLocales;
let mockSelectLanguage;
let mockIsTestNet;

beforeEach(() => {
  mockSortedLocales = sel.sortedLocales = jest.fn(() => {
    return testLocalesArray;
  });
  mockSelectLanguage = da.selectLanguage = jest.fn(() => () => {});
  mockIsTestNet = sel.isTestNet = jest.fn(() => false);
  sel.stakeTransactions = jest.fn(() => []);
});

test("render language select page", () => {
  render(<LanguageSelectPage />);
  expect(screen.getByText(/welcome to decrediton wallet/i)).toBeInTheDocument();
  expect(screen.getByText(/choose your language/i)).toBeInTheDocument();
  expect(screen.getByText(testLocalesArray[0].description)).toBeInTheDocument();
  expect(screen.getByTestId("getstarted-pagebody").className).not.toMatch(
    /testnetBody/
  );

  // rest of the languages should not visible
  for (let i = 1; i < testLocalesArray.length; i++) {
    expect(
      screen.queryByText(testLocalesArray[i].description)
    ).not.toBeInTheDocument();
  }

  user.click(screen.getByText(testLocalesArray[0].description));
  expect(mockSortedLocales).toHaveBeenCalled();
  mockSortedLocales.mockRestore();

  // rest of the languages should visible
  for (let i = 1; i < testLocalesArray.length; i++) {
    expect(
      screen.getByText(testLocalesArray[i].description)
    ).toBeInTheDocument();
  }

  user.click(
    screen.getByText(testLocalesArray[testLocalesArray.length - 1].description)
  );
  // just the choosen language should be visible
  expect(
    screen.getByText(testLocalesArray[testLocalesArray.length - 1].description)
  ).toBeInTheDocument();
  for (let i = 1; i < testLocalesArray.length - 1; i++) {
    expect(
      screen.queryByText(testLocalesArray[i].description)
    ).not.toBeInTheDocument();
  }

  user.click(screen.getByText(/continue/i));
  expect(mockSelectLanguage).toHaveBeenCalledWith(
    testLocalesArray[testLocalesArray.length - 1]
  );
});

test("render language select page in testnet mode", () => {
  mockIsTestNet = sel.isTestNet = jest.fn(() => true);
  render(<LanguageSelectPage />);
  expect(mockIsTestNet).toHaveBeenCalled();
  expect(screen.getByTestId("getstarted-pagebody").className).toMatch(
    /testnetBody/
  );
});
