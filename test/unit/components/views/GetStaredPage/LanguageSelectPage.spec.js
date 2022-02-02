import LanguageSelectPage from "components/views/GetStartedPage/LanguageSelectPage/LanguageSelectPage";
import { render } from "test-utils.js";
import { screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import * as sel from "selectors";
import * as da from "actions/DaemonActions";

const testLocalesArray = [
  { key: "key1", description: "desc1", language: "lang1" },
  {
    key: "key2",
    description: "desc2",
    language: "lang2"
  },
  { key: "key3", description: "desc3", language: "lang3" }
];
const selectors = sel;
const daemonActions = da;

let mockSortedLocales;
let mockSelectLanguage;
let mockIsTestNet;

beforeEach(() => {
  mockSortedLocales = selectors.sortedLocales = jest.fn(() => testLocalesArray);
  selectors.defaultLocaleName = jest.fn(() => testLocalesArray[0].key);
  mockSelectLanguage = daemonActions.selectLanguage = jest.fn(() => () => {});
  mockIsTestNet = selectors.isTestNet = jest.fn(() => false);
  selectors.stakeTransactions = jest.fn(() => []);
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
  expect(mockSelectLanguage).toHaveBeenCalledWith({
    ...testLocalesArray[testLocalesArray.length - 1],
    label: testLocalesArray[testLocalesArray.length - 1].description,
    value: testLocalesArray[testLocalesArray.length - 1].key
  });
});

test("render language select page in testnet mode", () => {
  mockIsTestNet = selectors.isTestNet = jest.fn(() => true);
  render(<LanguageSelectPage />);
  expect(mockIsTestNet).toHaveBeenCalled();
  expect(screen.getByTestId("getstarted-pagebody").className).toMatch(
    /testnetBody/
  );
});
