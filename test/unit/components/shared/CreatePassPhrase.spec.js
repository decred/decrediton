import { CreatePassPhrase } from "shared";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";

const mockOnChange = jest.fn(() => {});
const mockOnSubmit = jest.fn(() => {});
const testPassword = "test-password";
const pleaseEnterErrorMsg = /please enter your private passphrase/i;
const passphrasesNotMatchMsg = /passphrases do not match/i;

test("test CreatePassPhrase component", () => {
  render(
    <CreatePassPhrase
      id="test-id"
      onChange={mockOnChange}
      onSubmit={mockOnSubmit}
    />
  );

  const privatePassphraseInput = screen.getByPlaceholderText(
    "Private Passphrase"
  );
  const repeatPrivatePassphraseInput = screen.getByPlaceholderText(
    "Confirm Private Passphrase"
  );

  expect(screen.queryByText(pleaseEnterErrorMsg)).not.toBeInTheDocument();
  expect(screen.queryByText(passphrasesNotMatchMsg)).not.toBeInTheDocument();
  // test please enter your private passphrase error message
  fireEvent.change(privatePassphraseInput, {
    target: { value: testPassword }
  });
  user.clear(privatePassphraseInput);
  expect(screen.getByText(pleaseEnterErrorMsg)).toBeInTheDocument();
  fireEvent.change(privatePassphraseInput, {
    target: { value: testPassword }
  });
  expect(screen.queryByText(pleaseEnterErrorMsg)).not.toBeInTheDocument();

  // test not matched passphrases
  fireEvent.change(repeatPrivatePassphraseInput, {
    target: { value: `mistyped ${testPassword}` }
  });
  expect(mockOnChange).toHaveBeenCalledWith(""); // passphrases are not valid
  expect(screen.getByText(passphrasesNotMatchMsg)).toBeInTheDocument();

  // type valid passphrases
  mockOnChange.mockClear();
  user.clear(repeatPrivatePassphraseInput);
  fireEvent.change(repeatPrivatePassphraseInput, {
    target: { value: testPassword }
  });
  expect(mockOnChange).toHaveBeenCalledWith(testPassword); // passphrases are valid now

  // test enter keydowns
  fireEvent.keyDown(privatePassphraseInput, { key: "enter", keyCode: 13 });
  fireEvent.keyDown(repeatPrivatePassphraseInput, {
    key: "enter",
    keyCode: 13
  });
  expect(mockOnSubmit).toHaveBeenCalledTimes(2);

  // test other than enter keydowns
  mockOnSubmit.mockClear();
  fireEvent.keyDown(privatePassphraseInput, { key: "A", code: "KeyA" });
  fireEvent.keyDown(repeatPrivatePassphraseInput, { key: "A", code: "KeyA" });
  expect(mockOnSubmit).toHaveBeenCalledTimes(0);
});
