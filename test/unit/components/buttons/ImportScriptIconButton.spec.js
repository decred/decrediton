import { ImportScriptIconButton } from "buttons";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import * as ca from "actions/ControlActions";
import * as sel from "selectors";

const testScript = "test-script";
const selectors = sel;
const controlActions = ca;

let mockRescanRequest;
let mockIsImportingScript;
let mockOnImportScript;
beforeEach(() => {
  mockOnImportScript = controlActions.manualImportScriptAttempt = jest.fn(
    () => () => Promise.resolve()
  );
  mockIsImportingScript = selectors.isImportingScript = jest.fn(() => false);
  mockRescanRequest = selectors.rescanRequest = jest.fn(() => false);
});

test("render ImportScriptIconButton", () => {
  render(<ImportScriptIconButton />);
  expect(screen.getByText(/import/i).textContent).toMatchInlineSnapshot(
    '"Manually import a redeem script for tickets."'
  );
  const button = screen.getByRole("button");
  user.click(button);

  expect(screen.getByText(/import redeem script/i)).toBeInTheDocument();
  // cancel modal first
  user.click(screen.getByText(/cancel/i));
  expect(screen.queryByText(/import redeem script/i)).not.toBeInTheDocument();

  // try again
  user.click(button);
  user.type(screen.getByLabelText(/script:/i), testScript);
  user.click(screen.getByText(/continue/i));
  expect(mockOnImportScript).toHaveBeenCalledWith(testScript);
  // modal has been closed
  expect(screen.queryByText(/import redeem script/i)).not.toBeInTheDocument();
  expect(mockRescanRequest).toHaveBeenCalled();
  expect(mockIsImportingScript).toHaveBeenCalled();
  expect(mockOnImportScript).toHaveBeenCalled();
});

test("render disabled ImportScriptIconButton (rescan is in progress)", () => {
  mockRescanRequest = selectors.rescanRequest = jest.fn(() => true);
  render(<ImportScriptIconButton />);
  const button = screen.getByRole("button");
  expect(button.disabled).toBe(true);
  user.click(button);
  expect(screen.queryByText(/import redeem script/i)).not.toBeInTheDocument();
});

test("render loading ImportScriptIconButton", () => {
  mockIsImportingScript = selectors.isImportingScript = jest.fn(() => true);
  render(<ImportScriptIconButton />);
  const button = screen.getByRole("button");
  expect(button.className).toMatch("loading");
});
