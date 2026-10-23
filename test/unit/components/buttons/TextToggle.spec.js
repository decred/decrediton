import { TextToggle } from "buttons";
import { render } from "test-utils.js";
import { screen } from "@testing-library/react";

const testLeftText = "test-left-text";
const testRightText = "test-right-text";
const mockToggleAction = jest.fn(() => {});
const testClassName = "test-class-name";
const testChildClassName = "test-child-class-name";

test("render TextToggle with left active button", async () => {
  const { user } = render(
    <TextToggle
      activeButton={"left"}
      leftText={testLeftText}
      rightText={testRightText}
      toggleAction={mockToggleAction}
      className={testClassName}
      childClassName={testChildClassName}
    />
  );
  const leftText = screen.getByText(testLeftText);
  const rightText = screen.getByText(testRightText);
  expect(leftText.parentNode.className).toMatch(testClassName);
  expect(leftText.className).toMatch(/active/i);
  expect(rightText.className).not.toMatch(/active/i);
  expect(leftText.className).toMatch(testChildClassName);
  expect(rightText.className).toMatch(testChildClassName);

  await user.click(rightText);
  expect(mockToggleAction).toHaveBeenCalledWith("right");
  expect(leftText.className).not.toMatch(/active/i);
  expect(rightText.className).toMatch(/active/i);

  await user.click(leftText);
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
  expect(leftText.parentNode.className).not.toMatch(testClassName);
  expect(leftText.className).not.toMatch(/active/i);
  expect(rightText.className).toMatch(/active/i);
  expect(leftText.className).not.toMatch(testChildClassName);
  expect(rightText.className).not.toMatch(testChildClassName);
});
