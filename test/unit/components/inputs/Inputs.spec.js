import {
  Input,
  NumericInput,
  IntegerInput,
  FloatInput,
  InlineField,
  PassphraseModalField,
  PasswordInput,
  SeedHexEntry,
  AddressInput,
  TextInput,
  SettingsTextInput,
  NumTicketsInput,
  PathBrowseInput,
  FileBrowserFilters
} from "inputs";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { useState } from "react";
import * as wallet from "wallet";

const inputDataTestId = "input-data-test-id";
const inputId = "input-id";
const testClassName = "test-class-name";
const testValue = "test-value";
const testSuccessMessage = "test-success-message";
const testInvalidMsg = "test-invalid-msg";
const testRequiredMsg = "test-required-msg";
const testUnit = "test-unit";
const testPlaceholder = "test-placeholder";
const invalidErrorMsg = "This field is wrong";
const requiredErrorMsg = "This field is required";
const anyArg = expect.anything;
const testFilePath = "test-filePath";

let mockOnChange;
let mockOnKeyDownSubmit;
let mockOnKeyDown;
let mockOnFocus;
let mockOnBlur;

beforeEach(() => {
  mockOnChange = jest.fn(() => {});
  mockOnKeyDownSubmit = jest.fn(() => {});
  mockOnKeyDown = jest.fn(() => {});
  mockOnFocus = jest.fn(() => {});
  mockOnBlur = jest.fn(() => {});
});

const getInputAndInputTag = (props) => {
  if (props && props.hidden) {
    return { input: screen.queryByTestId(inputDataTestId) };
  }
  const inputTag = screen.getByTestId(inputDataTestId);
  const input = inputTag.parentElement;
  return { input, inputTag };
};

const renderInput = (Comp, props) => {
  render(
    <Comp
      onChange={mockOnChange}
      dataTestId={inputDataTestId}
      id={inputId}
      {...props}
    />
  );
  return getInputAndInputTag(props);
};

const renderWrappedInput = (Comp, props) => {
  const Wrapper = () => {
    const [value, setValue] = useState();
    return (
      <Comp
        onChange={(e) => {
          setValue(e.target.value);
          mockOnChange(e);
        }}
        dataTestId={inputDataTestId}
        value={value}
        id={inputId}
        {...props}
      />
    );
  };
  render(<Wrapper />);
  return getInputAndInputTag(props);
};

const renderNumTicketsInput = (props) => {
  const Wrapper = () => {
    const [numTickets, setNumTickets] = useState(props && props.numTickets);
    return (
      <NumTicketsInput
        {...props}
        id={inputId}
        onChangeNumTickets={(e) => {
          setNumTickets(e);
        }}
        dataTestId={inputDataTestId}
        numTickets={numTickets}
        decrementNumTickets={() =>
          setNumTickets((numTicket) => parseInt(numTicket) - 1)
        }
        incrementNumTickets={() =>
          setNumTickets((numTicket) => parseInt(numTicket) + 1)
        }
        onKeyDown={mockOnKeyDown}
      />
    );
  };
  render(<Wrapper />);
  return getInputAndInputTag(props);
};

const checkDefaultInput = (
  input,
  inputTag,
  expectedType = "text",
  expecedPlaceholder = "",
  expectedValue = ""
) => {
  expect(input.className).not.toMatch(testClassName);
  expect(screen.queryByText(testSuccessMessage)).not.toBeInTheDocument();
  expect(screen.queryByText(invalidErrorMsg)).not.toBeInTheDocument();
  expect(screen.queryByText(testInvalidMsg)).not.toBeInTheDocument();
  expect(screen.queryByText(requiredErrorMsg)).not.toBeInTheDocument();
  expect(screen.queryByText(testRequiredMsg)).not.toBeInTheDocument();
  expect(screen.queryByText(testUnit)).not.toBeInTheDocument();

  expect(inputTag.value).toBe(expectedValue);
  expect(inputTag.type).toBe(expectedType);
  expect(inputTag.disabled).toBe(false);
  expect(inputTag.readOnly).toBe(false);
  expect(inputTag.placeholder.trim()).toBe(expecedPlaceholder);
};

test("render default input", () => {
  const { input, inputTag } = renderInput(Input);
  checkDefaultInput(input, inputTag);
});

test("render default NumericInput", () => {
  const { input, inputTag } = renderInput(NumericInput);
  checkDefaultInput(input, inputTag);
  expect(input.className).toMatch("numericInput");
});

test("render default IntegerInput", async () => {
  const { input, inputTag } = renderWrappedInput(IntegerInput);
  checkDefaultInput(input, inputTag);
  expect(input.className).toMatch("numericInput");
  await user.type(inputTag, "1.89a&%}");
  expect(inputTag.value).toBe("189");
});

test("render default FloatInput", async () => {
  const { input, inputTag } = renderWrappedInput(FloatInput, {
    maxFracDigits: 3
  });
  checkDefaultInput(input, inputTag);
  expect(input.className).toMatch("numericInput");
  await user.type(inputTag, "1.89a&%4234}");
  expect(inputTag.value).toBe("1.894");
});

test("render inlineField", () => {
  const testLabel = "test-label";
  render(
    <InlineField label={testLabel}>
      <input />
    </InlineField>
  );
  expect(screen.getByLabelText(testLabel)).toBeInTheDocument();
});

test("render passphraseModalField", () => {
  const testLabel = "test-label";
  render(
    <PassphraseModalField label={testLabel}>
      <input />
    </PassphraseModalField>
  );
  expect(screen.getByLabelText(`${testLabel}:`)).toBeInTheDocument();
});

test("render default PasswordInput", async () => {
  const { input, inputTag } = renderInput(PasswordInput);
  checkDefaultInput(input, inputTag, "password");
  expect(inputTag.type).toBe("password");
  const togglePasswordVisibilityButton = screen.getByRole("button", {
    name: "Toggle Passsword Visibility"
  });

  await user.click(togglePasswordVisibilityButton);
  expect(inputTag.type).toBe("text");

  await user.click(togglePasswordVisibilityButton);
  expect(inputTag.type).toBe("password");
});

test("render default SeedHexEntry", () => {
  const { input, inputTag } = renderInput(SeedHexEntry);
  checkDefaultInput(
    input,
    inputTag,
    "text",
    "Enter the hex representation of your seed..."
  );
});

test("render default AddressInput", () => {
  const { input, inputTag } = renderInput(AddressInput);
  checkDefaultInput(input, inputTag);
});

test("render default TextInput", () => {
  const { input, inputTag } = renderInput(TextInput);
  checkDefaultInput(input, inputTag);
});

test("render default SettingsTextInput", () => {
  const { input, inputTag } = renderInput(SettingsTextInput);
  checkDefaultInput(input, inputTag);
});

test("test focus and blur event", () => {
  const { inputTag } = renderInput(Input, {
    onFocus: mockOnFocus,
    onBlur: mockOnBlur
  });
  inputTag.focus();
  expect(mockOnFocus).toHaveBeenCalled();

  inputTag.blur();
  expect(mockOnBlur).toHaveBeenCalled();
});

test("test key down events", () => {
  const { inputTag } = renderInput(Input, {
    onKeyDown: mockOnKeyDown,
    onKeyDownSubmit: mockOnKeyDownSubmit
  });
  inputTag.focus();
  fireEvent.keyDown(document.activeElement || document.body);
  expect(mockOnKeyDown).toHaveBeenCalled();
  expect(mockOnKeyDownSubmit).not.toHaveBeenCalled();

  // press enter
  fireEvent.keyDown(document.activeElement || document.body, {
    key: "enter",
    keyCode: 13
  });
  expect(mockOnKeyDownSubmit).toHaveBeenCalled();
});

test("test autoFocused input", () => {
  renderInput(Input, {
    onFocus: mockOnFocus,
    autoFocus: true
  });
  expect(mockOnFocus).toHaveBeenCalled();
});

test("render hidden input", () => {
  const { input } = renderInput(Input, { hidden: true });
  expect(input).not.toBeInTheDocument();
});

test("render input with className prop", () => {
  const { input } = renderInput(Input, { className: testClassName });
  expect(input.className).toMatch(testClassName);
});

test("render disabled input", () => {
  const { inputTag } = renderInput(Input, {
    disabled: true
  });
  expect(inputTag.disabled).toBe(true);
});

test("check custom inputTag props", () => {
  const { inputTag } = renderInput(Input, {
    type: "password",
    readOnly: true,
    placeholder: testPlaceholder,
    value: testValue
  });
  expect(inputTag.type).toBe("password");
  expect(inputTag.readOnly).toBe(true);
  expect(inputTag.placeholder).toBe(testPlaceholder);
  expect(inputTag.value).toBe(testValue);
});

test("render input in success state", () => {
  renderInput(Input, {
    showSuccess: true,
    successMessage: testSuccessMessage
  });
  expect(screen.getByText(testSuccessMessage)).toBeInTheDocument();
});

test("render input in success state (without successMessage)", () => {
  renderInput(Input, {
    showSuccess: true
  });
  expect(screen.queryByText(testSuccessMessage)).not.toBeInTheDocument();
});

test("render input in error state (has value but it is invalid )", () => {
  renderInput(Input, {
    showErrors: true,
    value: testValue,
    invalid: true
  });
  expect(screen.getByText(invalidErrorMsg)).toBeInTheDocument();
  expect(screen.queryByText(testInvalidMsg)).not.toBeInTheDocument();
});

test("render input in error state (has value but it is invalid ) with custom msg", () => {
  renderInput(Input, {
    showErrors: true,
    value: testValue,
    invalid: true,
    invalidMessage: testInvalidMsg
  });
  expect(screen.getByText(testInvalidMsg)).toBeInTheDocument();
  expect(screen.queryByText(invalidErrorMsg)).not.toBeInTheDocument();
});

test("render input in error state (has no value but it would be required )", () => {
  renderInput(Input, {
    showErrors: true,
    required: true
  });
  expect(screen.getByText(requiredErrorMsg)).toBeInTheDocument();
  expect(screen.queryByText(testRequiredMsg)).not.toBeInTheDocument();
});

test("render input in error state (has no value but it would be required ) with custom msg", () => {
  const { input } = renderInput(Input, {
    showErrors: true,
    required: true,
    requiredMessage: testRequiredMsg
  });
  expect(input.className).toMatch("error");
  expect(screen.getByText(testRequiredMsg)).toBeInTheDocument();
  expect(screen.queryByText(requiredErrorMsg)).not.toBeInTheDocument();
});

test("render input with unit", () => {
  renderInput(Input, { unit: testUnit });
  const unitElement = screen.getByText(testUnit);
  expect(unitElement.className).not.toMatch("error");
});

test("render input with unit in error state", () => {
  renderInput(Input, { unit: testUnit, showErrors: true, required: true });
  const unitElement = screen.getByText(testUnit);
  expect(unitElement.className).toMatch("error");
});

test("render default NumTicketsInput", async () => {
  const testInitValue = "1";
  const { input, inputTag } = renderNumTicketsInput({
    numTickets: testInitValue
  });
  checkDefaultInput(input, inputTag, "text", "", testInitValue);
  expect(input.className).toMatch("numericInput");
  expect(input.className).toMatch("integerInput");
  expect(screen.getByText("ticket")).toBeInTheDocument(); // single ticket
  //manual type a value
  await user.type(inputTag, "2.3");
  expect(inputTag.value).toBe("123");
  expect(screen.getByText("tickets")).toBeInTheDocument(); // multiple tickets

  /* test buttons */
  const lessButton = screen.getByRole("button", { name: "less" });
  await user.click(lessButton);
  expect(inputTag.value).toBe("122");

  const moreButton = screen.getByRole("button", { name: "more" });
  await user.click(moreButton);
  expect(inputTag.value).toBe("123");

  /* test arrow key */
  fireEvent.keyDown(inputTag, { keyCode: 38 });
  expect(mockOnKeyDown).toHaveBeenCalled();
});

test("render invalid NumTicketsInput", () => {
  const testInitValue = "1";
  const { input, inputTag } = renderNumTicketsInput({
    numTickets: testInitValue,
    invalid: true
  });
  checkDefaultInput(input, inputTag, "text", "", testInitValue);
  expect(screen.queryByText("Ticket")).not.toBeInTheDocument();
  expect(screen.queryByText("Tickets")).not.toBeInTheDocument();
});

test("open file with PathBrowseInput", async () => {
  const { input, inputTag } = renderInput(PathBrowseInput, {
    filters: [FileBrowserFilters.csv, FileBrowserFilters.all],
    type: "file"
  });
  checkDefaultInput(input, inputTag);
  expect(screen.getByText("Select a path")).toBeInTheDocument();

  /* electron returns both filePaths and filePath */
  wallet.showOpenDialog.mockReturnValueOnce({
    filePaths: [testFilePath],
    filePath: testFilePath
  });
  await user.click(screen.getByRole("button", { name: "Select a path" }));
  expect(wallet.showOpenDialog).toHaveBeenCalledWith(anyArg());
  await waitFor(() => expect(mockOnChange).toHaveBeenCalledWith(testFilePath));

  /* electron return only filePath */
  mockOnChange.mockRestore();
  await user.clear(inputTag);
  wallet.showOpenDialog.mockReturnValueOnce({ filePath: testFilePath });
  await user.click(screen.getByRole("button", { name: "Select a path" }));
  expect(wallet.showOpenDialog).toHaveBeenCalledWith(anyArg());
  await waitFor(() => expect(mockOnChange).toHaveBeenCalledWith(testFilePath));

  /* electron does not return filePaths or filePath */
  mockOnChange.mockRestore();
  await user.clear(inputTag);
  wallet.showOpenDialog.mockReturnValueOnce({});
  await user.click(screen.getByRole("button", { name: "Select a path" }));
  expect(wallet.showOpenDialog).toHaveBeenCalledWith(anyArg());
  await waitFor(() =>
    expect(mockOnChange).not.toHaveBeenCalledWith(testFilePath)
  );

  /* write path into input directly*/
  const filePathManual = "t";
  mockOnChange.mockRestore();
  wallet.showOpenDialog.mockRestore();
  await user.clear(inputTag);
  await user.type(inputTag, filePathManual);
  expect(wallet.showOpenDialog).not.toHaveBeenCalled();
  await waitFor(() =>
    expect(mockOnChange).toHaveBeenCalledWith(filePathManual)
  );
});

test("save directory with PathBrowseInput", async () => {
  const { input, inputTag } = renderInput(PathBrowseInput, {
    save: true,
    type: "directory"
  });
  checkDefaultInput(input, inputTag);
  expect(screen.getByText("Select a path")).toBeInTheDocument();
  wallet.showSaveDialog.mockReturnValueOnce({ filePath: testFilePath });
  await user.click(screen.getByRole("button", { name: "Select a path" }));
  expect(wallet.showSaveDialog).toHaveBeenCalledWith(anyArg());
  await waitFor(() => expect(mockOnChange).toHaveBeenCalledWith(testFilePath));
});
