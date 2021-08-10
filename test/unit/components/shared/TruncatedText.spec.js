import { TruncatedText } from "shared";
import { render } from "test-utils.js";
import { screen } from "@testing-library/react";

const mockText = "abcdefghijklmnopqrstuvwxyz";
const containerTestId = "test-id";

const testTruncate = (max, expected, showTooltip) => {
  render(
    <div data-testid={containerTestId}>
      <TruncatedText text={mockText} max={max} showTooltip={showTooltip} />
    </div>
  );
  expect(screen.getByTestId(containerTestId).textContent).toBe(expected);
};

test.each([
  [null, mockText, false],
  [undefined, mockText, false],
  [10, `${mockText}abcde...vwxyz`, true], // show original text as tooltip + truncated text
  [20, "abcdefghij...qrstuvwxyz", false],
  [21, "abcdefghij...pqrstuvwxyz", false],
  [mockText.length - 1, "abcdefghijkl...nopqrstuvwxyz", false],
  [mockText.length, mockText, false],
  [30, mockText, false]
])("%s truncated to '%s'", testTruncate);
