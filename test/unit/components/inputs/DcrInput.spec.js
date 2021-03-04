import { DcrInput } from "inputs";
import { useState } from "react";
import { fireEvent, screen } from "@testing-library/react";
import { render } from "test-utils.js";
import * as sel from "selectors";
import { DCR } from "constants";

describe("DcrInput in DCR mode works", () => {
  sel.currencyDisplay = jest.fn(() => DCR);
  const expectAfterChange = (targetValue, displayValue) => {
    const Wrapper = () => {
      const [amount, setAmount] = useState(0);
      return (
        <DcrInput
          onChangeAmount={(atomValue) => {
            setAmount(atomValue);
          }}
          amount={amount}
        />
      );
    };
    render(<Wrapper />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: targetValue }
    });
    expect(screen.getByRole("textbox")).toHaveValue(displayValue);
  };

  test.each([
    [null, ""],
    [undefined, "0"],
    ["", ""],
    ["0", "0"],
    ["0.", "0."],
    [".", "0."],
    ["0.0", "0.0"],
    ["0.01", "0.01"],
    ["0.010", "0.010"],
    ["0.0000000", "0.0000000"],
    ["0.00000000", "0.00000000"],
    ["0.00000001", "0.00000001"],
    ["0.1", "0.1"],
    ["0.99999999", "0.99999999"],
    ["1", "1"],
    ["1.", "1."],
    ["1.0", "1.0"],
    ["1.01", "1.01"],
    ["1.010", "1.010"],
    ["1.0000000", "1.0000000"],
    ["1.00000001", "1.00000001"],
    ["1.1", "1.1"],
    ["1.10", "1.10"],
    ["1.101", "1.101"],
    ["1.00000000", "1.00000000"],
    ["1.00000001", "1.00000001"],
    ["1.000000001", "1.00000000"],
    ["123.918", "123.918"],
    ["102891.28183707", "102891.28183707"],
    ["20999999.9999999", "20999999.9999999"],
    ["20999999.99999999", "20999999.99999999"],
    ["a", ""],
    ["1a", "1"],
    ["1.2b", "1.2"],
    ["1.2.", "1.2"],
    ["1.2.2", "1.2"],
    ["1,", "1."],
    ["1,2", "1.2"]
  ])("'%s' into '%s'", expectAfterChange);
});
