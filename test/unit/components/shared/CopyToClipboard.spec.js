import { CopyToClipboard } from "shared";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import copy from "clipboard-copy";
import { fireEvent } from "@testing-library/react";
jest.mock("clipboard-copy");

let mockCopy;

const testTextToCopy = "test-text-to-copy";
const testClassName = "test-class-name";

beforeEach(() => {
  mockCopy = copy.mockImplementation(() => true);
});

test("test CopyToClipboard", () => {
  render(
    <CopyToClipboard textToCopy={testTextToCopy} className={testClassName} />
  );

  // success indicator should be hidden initially
  const copied = screen.getByText("Copied");
  expect(copied.className).toMatch("hidden");
  const copyIcon = screen.getByRole("button", { name: "Copy" });

  // success indicator should appear after successful copy
  user.click(copyIcon);
  expect(mockCopy).toHaveBeenCalledWith(testTextToCopy);
  expect(copied.className).not.toMatch("hidden");

  // success indicator should disappear after mouseLeave event
  fireEvent.mouseOut(copyIcon);
  expect(copied.className).toMatch("hidden");
});
