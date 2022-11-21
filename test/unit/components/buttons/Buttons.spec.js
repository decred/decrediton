import {
  Button,
  CloseButton,
  DangerButton,
  InvisibleButton,
  KeyBlueButton,
  SlateGrayButton
} from "buttons";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";

const testClassName = "test-class-name";
const testButtonLabel = "test-button-label";
const testStyle = { margin: "1px" };

let mockOnClick;
beforeEach(() => {
  mockOnClick = jest.fn(() => {});
});
test("render default Button", () => {
  render(
    <Button className={testClassName} onClick={mockOnClick} style={testStyle}>
      {testButtonLabel}
    </Button>
  );

  const button = screen.getByRole("button");
  expect(screen.getByText(testButtonLabel)).toBeInTheDocument();
  expect(button.className).toMatch(testClassName);
  expect(button.style.margin).toMatch(testStyle.margin);
  expect(button.disabled).toBe(false);
  user.click(button);
  expect(mockOnClick).toHaveBeenCalled();
});

test("render disabled Button", () => {
  render(
    <Button onClick={mockOnClick} disabled>
      {testButtonLabel}
    </Button>
  );

  const button = screen.getByRole("button");
  user.click(button);
  expect(button.disabled).toBe(true);
  expect(mockOnClick).not.toHaveBeenCalled();
});

test("render hidden Button", () => {
  render(<Button hidden>{testButtonLabel}</Button>);

  const buttons = screen.queryAllByRole("button");
  expect(buttons.length).toBe(0);
});

test("render block Button", () => {
  render(
    <Button style={testStyle} block>
      {testButtonLabel}
    </Button>
  );

  const button = screen.getByRole("button");
  expect(button.style.display).toMatch("block");
  expect(button.style.margin).toMatch(testStyle.margin);
});

test("render loading Button", () => {
  render(<Button loading>{testButtonLabel}</Button>);
  expect(screen.queryByText(testButtonLabel)).not.toBeInTheDocument();
});

test("render default CloseButton", () => {
  render(
    <CloseButton className={testClassName}>{testButtonLabel}</CloseButton>
  );
  const button = screen.getByRole("button");
  expect(button.className).toMatch(testClassName);
  expect(button.className).toMatch(/close/);
});

test("render default DangerButton", () => {
  render(<DangerButton>{testButtonLabel}</DangerButton>);
  const button = screen.getByRole("button");
  expect(button.className).toMatch(/danger/);
});

test("render default InvisibleButton", () => {
  render(<InvisibleButton>{testButtonLabel}</InvisibleButton>);
  const button = screen.getByRole("button");
  expect(button.className).toMatch(/invisible/);
});

test("render default KeyBlueButton", () => {
  render(<KeyBlueButton>{testButtonLabel}</KeyBlueButton>);
  const button = screen.getByRole("button");
  expect(button.className).toMatch("keyBlueButton");
});

test("render default SlateGrayButton", () => {
  render(<SlateGrayButton>{testButtonLabel}</SlateGrayButton>);
  const button = screen.getByRole("button");
  expect(button.className).toMatch("slateGrayButton");
});
