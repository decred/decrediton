import TutorialPage from "components/views/GetStartedPage/TutorialPage/TutorialPage";
import { render } from "test-utils.js";
import { screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import * as sel from "selectors";

import * as da from "actions/DaemonActions";

let mockFinishTutorial;

beforeEach(() => {
  mockFinishTutorial = da.finishTutorial = jest.fn(() => () => {});
  sel.stakeTransactions = jest.fn(() => []);
});

const checkIndicator = (currentIndex) => {
  for (let i = 0; i <= 3; i++) {
    const currentIndicator = screen.getByRole("link", { name: `step-${i}` });
    if (i == currentIndex) {
      expect(currentIndicator.className).toMatch(/current/);
    } else if (i < currentIndex) {
      expect(currentIndicator.className).toMatch(/checked/);
    } else if (i > currentIndex) {
      expect(currentIndicator.className).toMatch(/unchecked/);
    }
  }
};

test("clicking through the tutorial page using `Next` button", () => {
  render(<TutorialPage />);
  // check first page
  checkIndicator(0);
  // check second page
  user.click(screen.getByText(/next/i));
  checkIndicator(1);
  // check third page
  user.click(screen.getByText(/next/i));
  checkIndicator(2);
  // check fourth page
  user.click(screen.getByText(/next/i));
  checkIndicator(3);

  // leave page using `Next` button
  user.click(screen.getByText(/next/i));
  // leave page using `Finish` button
  user.click(screen.getByText(/finish/i));
  expect(mockFinishTutorial).toHaveBeenCalledTimes(2);
});

test("clicking through the tutorial page using the indicators", () => {
  render(<TutorialPage />);
  // check first page
  checkIndicator(0);
  // check second page
  user.click(screen.getByRole("link", { name: "step-1" }));
  checkIndicator(1);
  // check third page
  user.click(screen.getByRole("link", { name: "step-2" }));
  checkIndicator(2);
  // check fourth page
  user.click(screen.getByRole("link", { name: "step-3" }));
  checkIndicator(3);
  // check first page again
  user.click(screen.getByRole("link", { name: "step-0" }));
  checkIndicator(0);
});

test("leave tutorial page using `Skip` button", () => {
  render(<TutorialPage />);

  user.click(screen.getByText(/skip/i));
  expect(mockFinishTutorial).toHaveBeenCalledTimes(1);
});
