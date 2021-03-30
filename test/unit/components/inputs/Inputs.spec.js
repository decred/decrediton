import {
  Input,
  NumericInput,
  IntegerInput,
  FloatInput,
  BlocksInput,
  FeeInput,
  PercentInput,
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
import { screen, wait } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { useState } from "react";
import * as sel from "selectors";
import { ipcRenderer } from "electron";

const inputDataTestId = "input-data-test-id";
const testClassName = "test-class-name";
const testValue = "test-value";
const testSuccessMessage = "test-success-message";
const testInvalidMsg = "test-invalid-msg";
const testRequiredMsg = "test-required-msg";
const testUnit = "test-unit";
const testPlaceholder = "test-placeholder";
const invalidErrorMsg = "This field is wrong";
const requiredErrorMsg = "This field is required";
const testCurrency = "DCR-test";
const anyArg = expect.anything;
const testFilePath = "test-filePath";
const selectors = sel;

let mockCurrencyDisplay;
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
  mockCurrencyDisplay = selectors.currencyDisplay = jest.fn(() => testCurrency);
});

const getInputAndInputTag = (props) => {
  if (props && props.hidden) {
    return { input: screen.queryByTestId(inputDataTestId) };
  }
  const input = screen.getByTestId(inputDataTestId);
  const getInputTag = () => input.firstElementChild;
  return { input, inputTag: getInputTag() };
};

const renderInput = (Comp, props) => {
  render(
    <Comp onChange={mockOnChange} dataTestId={inputDataTestId} {...props} />
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
  expect(input.className).not.toMatch("disabled");
  expect(input.className).not.toMatch("error");
  expect(input.className).not.toMatch("success");
  expect(input.className).not.toMatch("active");
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
  expect(inputTag.placeholder).toBe(expecedPlaceholder);
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

test("render default IntegerInput", () => {
  const { input, inputTag } = renderWrappedInput(IntegerInput);
  checkDefaultInput(input, inputTag);
  expect(input.className).toMatch("numericInput");
  user.type(inputTag, "1.89a&%}");
  expect(inputTag.value).toBe("189");
});

test("render default FloatInput", () => {
  const { input, inputTag } = renderWrappedInput(FloatInput, {
    maxFracDigits: 3
  });
  checkDefaultInput(input, inputTag);
  expect(input.className).toMatch("numericInput");
  user.type(inputTag, "1.89a&%4234}");
  expect(inputTag.value).toBe("1.894");
});

test("render default BlocksInput", () => {
  const { input, inputTag } = renderWrappedInput(BlocksInput);
  checkDefaultInput(input, inputTag);
  expect(input.className).toMatch("numericInput");
  user.type(inputTag, "1.89a&%4234}");
  expect(inputTag.value).toBe("1.894234");
  expect(screen.getByText("blocks").className).toMatch("unitArea");
  expect(screen.getByText("blocks").className).toMatch("numericInputUnitArea");
});

test("render default FeeInput", () => {
  const { input, inputTag } = renderInput(FeeInput);
  checkDefaultInput(input, inputTag);
  expect(input.className).toMatch("numericInput");
  expect(screen.getByText(`${testCurrency}/KB`));
  expect(mockCurrencyDisplay).toHaveBeenCalled();
});

test("render default PercentInput", () => {
  const { input, inputTag } = renderInput(PercentInput);
  checkDefaultInput(input, inputTag);
  expect(input.className).toMatch("numericInput");
  expect(screen.getByText("%"));
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

test("render default PasswordInput", () => {
  const { input, inputTag } = renderInput(PasswordInput);
  checkDefaultInput(input, inputTag, "password");
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
  const { input, inputTag } = renderInput(Input, {
    onFocus: mockOnFocus,
    onBlur: mockOnBlur
  });
  inputTag.focus();
  expect(input.className).toMatch("active");
  expect(mockOnFocus).toHaveBeenCalled();

  inputTag.blur();
  expect(input.className).not.toMatch("active");
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
  const { input } = renderInput(Input, {
    onFocus: mockOnFocus,
    autoFocus: true
  });
  expect(input.className).toMatch("active");
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
  const { input, inputTag } = renderInput(Input, {
    disabled: true
  });
  expect(input.className).toMatch("disabled");
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
  const { input } = renderInput(Input, {
    showSuccess: true,
    successMessage: testSuccessMessage
  });
  expect(input.className).toMatch("success");
  expect(screen.getByText(testSuccessMessage)).toBeInTheDocument();
});

test("render input in success state (without successMessage)", () => {
  const { input } = renderInput(Input, {
    showSuccess: true
  });
  expect(input.className).toMatch("success");
  expect(screen.queryByText(testSuccessMessage)).not.toBeInTheDocument();
});

test("render input in error state (has value but it is invalid )", () => {
  const { input } = renderInput(Input, {
    showErrors: true,
    value: testValue,
    invalid: true
  });
  expect(input.className).toMatch("error");
  expect(screen.getByText(invalidErrorMsg)).toBeInTheDocument();
  expect(screen.queryByText(testInvalidMsg)).not.toBeInTheDocument();
});

test("render input in error state (has value but it is invalid ) with custom msg", () => {
  const { input } = renderInput(Input, {
    showErrors: true,
    value: testValue,
    invalid: true,
    invalidMessage: testInvalidMsg
  });
  expect(input.className).toMatch("error");
  expect(screen.getByText(testInvalidMsg)).toBeInTheDocument();
  expect(screen.queryByText(invalidErrorMsg)).not.toBeInTheDocument();
});

test("render input in error state (has no value but it would be required )", () => {
  const { input } = renderInput(Input, {
    showErrors: true,
    required: true
  });
  expect(input.className).toMatch("error");
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

test("render default NumTicketsInput", () => {
  const testInitValue = "1";
  const { input, inputTag } = renderNumTicketsInput({
    numTickets: testInitValue
  });
  checkDefaultInput(input, inputTag, "text", "", testInitValue);
  expect(input.className).toMatch("numericInput");
  expect(input.className).toMatch("integerInput");
  expect(screen.getByText("ticket")).toBeInTheDocument(); // single ticket
  //manual type a value
  user.type(inputTag, "2.3");
  expect(inputTag.value).toBe("123");
  expect(screen.getByText("tickets")).toBeInTheDocument(); // multiple tickets

  /* test buttons */
  const lessButton = screen.getByRole("button", { name: "less" });
  user.click(lessButton);
  expect(inputTag.value).toBe("122");

  const moreButton = screen.getByRole("button", { name: "more" });
  user.click(moreButton);
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
  ipcRenderer.invoke.mockReturnValueOnce({
    filePaths: [testFilePath],
    filePath: testFilePath
  });
  user.click(screen.getByRole("button", { name: "Select a path" }));
  expect(ipcRenderer.invoke).toHaveBeenCalledWith("show-open-dialog", anyArg());
  await wait(() => expect(mockOnChange).toHaveBeenCalledWith(testFilePath));

  /* electron return only filePath */
  mockOnChange.mockRestore();
  user.clear(inputTag);
  ipcRenderer.invoke.mockReturnValueOnce({ filePath: testFilePath });
  user.click(screen.getByRole("button", { name: "Select a path" }));
  expect(ipcRenderer.invoke).toHaveBeenCalledWith("show-open-dialog", anyArg());
  await wait(() => expect(mockOnChange).toHaveBeenCalledWith(testFilePath));

  /* electron does not return filePaths or filePath */
  mockOnChange.mockRestore();
  user.clear(inputTag);
  ipcRenderer.invoke.mockReturnValueOnce({});
  user.click(screen.getByRole("button", { name: "Select a path" }));
  expect(ipcRenderer.invoke).toHaveBeenCalledWith("show-open-dialog", anyArg());
  await wait(() => expect(mockOnChange).not.toHaveBeenCalledWith(testFilePath));

  /* write path into input directly*/
  const filePathManual = "t";
  mockOnChange.mockRestore();
  ipcRenderer.invoke.mockRestore();
  user.clear(inputTag);
  user.type(inputTag, filePathManual);
  expect(ipcRenderer.invoke).not.toHaveBeenCalled();
  await wait(() => expect(mockOnChange).toHaveBeenCalledWith(filePathManual));
});

test("save directory with PathBrowseInput", async () => {
  const { input, inputTag } = renderInput(PathBrowseInput, {
    save: true,
    type: "directory"
  });
  checkDefaultInput(input, inputTag);
  expect(screen.getByText("Select a path")).toBeInTheDocument();
  ipcRenderer.invoke.mockReturnValueOnce({ filePath: testFilePath });
  user.click(screen.getByRole("button", { name: "Select a path" }));
  expect(ipcRenderer.invoke).toHaveBeenCalledWith("show-save-dialog", anyArg());
  await wait(() => expect(mockOnChange).toHaveBeenCalledWith(testFilePath));
});
