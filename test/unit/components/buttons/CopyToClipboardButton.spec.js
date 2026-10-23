import { CopyToClipboardButton } from "buttons";
import { render } from "test-utils.js";
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

test("test CopyToClipboardButton", async () => {
  const { user } = render(
    <CopyToClipboardButton
      textToCopy={testTextToCopy}
      className={testClassName}
    />
  );

  // success indicator should be hidden initially
  const copied = screen.getByText("Copied");
  expect(copied.className).toMatch("hidden");
  const copyIcon = screen.getByRole("button", { name: "Copy" });

  // success indicator should appear after successful copy
  await user.click(copyIcon);
  expect(mockCopy).toHaveBeenCalledWith(testTextToCopy);
  expect(copied.className).not.toMatch("hidden");

  // success indicator should disappear after mouseLeave event
  fireEvent.mouseOut(copyIcon);
  expect(copied.className).toMatch("hidden");
});
