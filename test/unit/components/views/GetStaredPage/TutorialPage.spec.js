import TutorialPage from "components/views/GetStartedPage/TutorialPage/TutorialPage";
import { render } from "test-utils.js";
import { screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import * as sel from "selectors";
import * as da from "actions/DaemonActions";

let mockFinishTutorial;

const selectors = sel;
const daemonActions = da;

beforeEach(() => {
  mockFinishTutorial = daemonActions.finishTutorial = jest.fn(() => () => {});
  selectors.stakeTransactions = jest.fn(() => []);
});

const checkIndicator = (currentIndex) => {
  for (let i = 0; i <= 3; i++) {
    const currentIndicator = screen.getByRole("button", { name: `step-${i}` });
    if (i == currentIndex) {
      expect(currentIndicator.className).toMatch(/current/);
    } else if (i < currentIndex) {
      expect(currentIndicator.className).toMatch(/checked/);
    } else if (i > currentIndex) {
      expect(currentIndicator.className).toMatch(/unchecked/);
    }
  }
};

test("clicking through the tutorial page using `Next` button", async () => {
  render(<TutorialPage />);
  // check first page
  checkIndicator(0);
  // check second page
  await user.click(screen.getByText(/next/i));
  checkIndicator(1);
  // check third page
  await user.click(screen.getByText(/next/i));
  checkIndicator(2);
  // check fourth page
  await user.click(screen.getByText(/next/i));
  checkIndicator(3);

  // leave page using `Next` button
  await user.click(screen.getByText(/next/i));
  // leave page using `Finish` button
  await user.click(screen.getByText(/finish/i));
  expect(mockFinishTutorial).toHaveBeenCalledTimes(2);
});

test("clicking through the tutorial page using the indicators", async () => {
  render(<TutorialPage />);
  // check first page
  checkIndicator(0);
  // check second page
  await user.click(screen.getByRole("button", { name: "step-1" }));
  checkIndicator(1);
  // check third page
  await user.click(screen.getByRole("button", { name: "step-2" }));
  checkIndicator(2);
  // check fourth page
  await user.click(screen.getByRole("button", { name: "step-3" }));
  checkIndicator(3);
  // check first page again
  await user.click(screen.getByRole("button", { name: "step-0" }));
  checkIndicator(0);
});

test("leave tutorial page using `Skip` button", async () => {
  render(<TutorialPage />);

  await user.click(screen.getByText(/skip/i));
  expect(mockFinishTutorial).toHaveBeenCalledTimes(1);
});
