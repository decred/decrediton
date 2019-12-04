import { DcrInput } from "inputs";
import { Provider } from "react-redux";

import { createStore } from "redux";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

const reducer = s => s;

// Test DcrInput component which loops back amount after an onChangeAmount event.
// This is roughly how users of DcrInput behave.
@autobind
class TestDcrInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { amount: 0 };
  }
  onChangeAmount({ atomValue }) {
    this.setState({ amount: atomValue });
  }
  render() {
    return <DcrInput amount={this.state.amount} onChangeAmount={this.onChangeAmount} />;
  }
}

function renderWithRedux(
  ui,
  { initialState, store = createStore(reducer, initialState) } = {}
) {
  return {
    ...render(<Provider store={store}>{ui}</Provider>),
    store
  };
}

describe("DcrInput in DCR mode works", () => {

  let queries;

  const expectAfterChange = (targetValue, displayValue) => {
    const { getByRole } = queries;
    fireEvent.change(getByRole("textbox"), { target: { value: targetValue } });
    expect(getByRole("textbox")).toHaveValue(displayValue);
  };

  beforeEach(() => {
    queries = renderWithRedux(
      <TestDcrInput />,
      { initialState: { settings: { currentSettings: { currencyDisplay: "DCR" } } } }
    );
  });


  test.each(
    [
      [ null, "" ],
      [ undefined, "0" ],
      [ "", "" ],
      [ "0", "0" ],
      [ "0.", "0." ],
      [ ".", "0." ],
      [ "0.0", "0.0" ],
      [ "0.01", "0.01" ],
      [ "0.010", "0.010" ],
      [ "0.0000000", "0.0000000" ],
      [ "0.00000000", "0.00000000" ],
      [ "0.00000001", "0.00000001" ],
      [ "0.1", "0.1" ],
      [ "0.99999999", "0.99999999" ],
      [ "1", "1" ],
      [ "1.", "1." ],
      [ "1.0", "1.0" ],
      [ "1.01", "1.01" ],
      [ "1.010", "1.010" ],
      [ "1.0000000", "1.0000000" ],
      [ "1.00000001", "1.00000001" ],
      [ "1.1", "1.1" ],
      [ "1.10", "1.10" ],
      [ "1.101", "1.101" ],
      [ "1.00000000", "1.00000000" ],
      [ "1.00000001", "1.00000001" ],
      [ "1.000000001", "1.00000000" ],
      [ "123.918", "123.918" ],
      [ "102891.28183707", "102891.28183707" ],
      [ "20999999.9999999", "20999999.9999999" ],
      [ "20999999.99999999", "20999999.99999999" ],
      [ "a", "" ],
      [ "1a", "1" ],
      [ "1.2b", "1.2" ],
      [ "1.2.", "1.2" ],
      [ "1.2.2", "1.2" ],
      [ "1,", "1." ],
      [ "1,2", "1.2" ]
    ],
  )("'%s' into '%s'", expectAfterChange);
});
