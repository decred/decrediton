import { TabbedPage, TitleHeader, DescriptionHeader } from "layout";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import * as sel from "selectors";
import { TRANSACTIONS_ICON } from "constants";

const selectors = sel;

const testPageHeaderTitle = "test-page-header-title";
const testContent1 = "test-content-1";
const testContent2 = "test-content-2";
const testContent3 = "test-content-3";
const testLabel1 = "test-label-1";
const testLabel2 = "test-label-2";
const testLabel3 = "test-label-3";
const testDesc1 = "test-desc-1";
const testDesc2 = "test-desc-2";
const testDesc3 = "test-desc-3";
const testOptionalButtonLabel = "test-optional-button-label";

const TestContent1 = () => <div>{testContent1}</div>;
const TestContent2 = () => <div>{testContent2}</div>;
const TestContent3 = () => <div>{testContent3}</div>;
const TestPageHeader = () => (
  <TitleHeader iconType={TRANSACTIONS_ICON} title={testPageHeaderTitle} />
);
const TestPageHeaderWithOptionalButton = () => (
  <TitleHeader
    iconType={TRANSACTIONS_ICON}
    title={testPageHeaderTitle}
    optionalButton={<button>{testOptionalButtonLabel}</button>}
  />
);
const TestTabHeader1 = () => <DescriptionHeader description={testDesc1} />;
const TestTabHeader2 = () => <DescriptionHeader description={testDesc2} />;
const TestTabHeader3 = () => <DescriptionHeader description={testDesc3} />;
const tabs = [
  {
    path: "/test/path1",
    content: TestContent1,
    header: TestTabHeader1,
    label: testLabel1
  },
  {
    path: "/test/path2",
    content: TestContent2,
    header: TestTabHeader2,
    label: testLabel2
  },
  {
    path: "/test/path3",
    content: TestContent3,
    header: TestTabHeader3,
    label: testLabel3
  }
];

beforeEach(() => {
  selectors.uiAnimations = jest.fn(() => true);
});

test("test tabs with animation", async () => {
  render(<TabbedPage header={<TestPageHeader />} tabs={tabs} />);

  expect(screen.getByText(testPageHeaderTitle)).toBeInTheDocument();

  // the first tab should be active by default
  expect(screen.getByText(testContent1)).toBeInTheDocument();
  expect(screen.getByText(testDesc1)).toBeInTheDocument();

  // move to the second tab
  await user.click(screen.getByText(testLabel2));
  expect(screen.getByText(testContent2)).toBeInTheDocument();
  expect(screen.getByText(testDesc2)).toBeInTheDocument();

  // move to the third tab
  await user.click(screen.getByText(testLabel3));
  expect(screen.getByText(testContent3)).toBeInTheDocument();
  expect(screen.getByText(testDesc3)).toBeInTheDocument();
});

test("test tabs without animation", async () => {
  selectors.uiAnimations = jest.fn(() => false);
  render(<TabbedPage header={<TestPageHeader />} tabs={tabs} />);

  expect(screen.getByText(testPageHeaderTitle)).toBeInTheDocument();

  // the first tab should be active by default
  expect(screen.getByText(testContent1)).toBeInTheDocument();
  expect(screen.getByText(testDesc1)).toBeInTheDocument();

  // move to the second tab
  await user.click(screen.getByText(testLabel2));
  expect(screen.getByText(testContent2)).toBeInTheDocument();
  expect(screen.getByText(testDesc2)).toBeInTheDocument();

  // move to the third tab
  await user.click(screen.getByText(testLabel3));
  expect(screen.getByText(testContent3)).toBeInTheDocument();
  expect(screen.getByText(testDesc3)).toBeInTheDocument();
});

test("test tabs with optional button", () => {
  render(
    <TabbedPage header={<TestPageHeaderWithOptionalButton />} tabs={tabs} />
  );
  expect(screen.getByText(testOptionalButtonLabel)).toBeInTheDocument();
});

test("test tabs with initial location", () => {
  selectors.location = jest.fn(() => {
    return {
      pathname: tabs[1].path
    };
  });
  render(<TabbedPage header={<TestPageHeader />} tabs={tabs} />);
  expect(screen.getByText(testContent2)).toBeInTheDocument();
  expect(screen.getByText(testDesc2)).toBeInTheDocument();
});

test("test tabs content with props", () => {
  const tabsCopy = [...tabs];
  const TestComponent = ({ label }) => <div>{label}</div>;
  const testComponentLabel = "test-component-label";
  tabsCopy[0].content = <TestComponent label={testComponentLabel} />;
  render(<TabbedPage header={<TestPageHeader />} tabs={tabs} />);
  expect(screen.getByText(testComponentLabel)).toBeInTheDocument();
});
