import { TextToggle } from "buttons";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";

const testLeftText = "test-left-text";
const testRightText = "test-right-text";
const mockToggleAction = jest.fn(() => {});

test("render TextToggle with left active button", () => {
  render(
    <TextToggle
      activeButton={"left"}
      leftText={testLeftText}
      rightText={testRightText}
      toggleAction={mockToggleAction}
    />
  );
  const leftText = screen.getByText(testLeftText);
  const rightText = screen.getByText(testRightText);
  expect(leftText.className).toMatch(/active/i);
  expect(rightText.className).not.toMatch(/active/i);

  user.click(rightText);
  expect(mockToggleAction).toHaveBeenCalledWith("right");
  expect(leftText.className).not.toMatch(/active/i);
  expect(rightText.className).toMatch(/active/i);

  user.click(leftText);
  expect(mockToggleAction).toHaveBeenCalledWith("left");
  expect(leftText.className).toMatch(/active/i);
  expect(rightText.className).not.toMatch(/active/i);
});

test("render TextToggle with right active button", () => {
  render(
    <TextToggle
      activeButton={"right"}
      leftText={testLeftText}
      rightText={testRightText}
      toggleAction={mockToggleAction}
    />
  );
  const leftText = screen.getByText(testLeftText);
  const rightText = screen.getByText(testRightText);
  expect(leftText.className).not.toMatch(/active/i);
  expect(rightText.className).toMatch(/active/i);
});
