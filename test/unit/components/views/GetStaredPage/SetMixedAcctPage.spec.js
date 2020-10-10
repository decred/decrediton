import SetMixedAcctPage from "components/views/GetStartedPage/SetMixedAcctPage/SetMixedAcctPage";
import { render } from "test-utils.js";
import { screen, wait } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import user from "@testing-library/user-event";

import * as ama from "actions/AccountMixerActions";
import * as ca from "actions/ControlActions";
import { MIXED_ACCOUNT, CHANGE_ACCOUNT } from "constants";

const testCoinjoinSumByAcct = [
  { acctIdx: 0, coinjoinSum: 1 },
  { acctIdx: 1, coinjoinSum: 2 },
  { acctIdx: 2, coinjoinSum: 4 }
];

let mockGetCoinjoinOutputspByAcct;
let mockRenameAccountAttempt;
let mockSetCoinjoinCfg;
let mockOnSendContinue;

beforeEach(() => {
  mockGetCoinjoinOutputspByAcct = ama.getCoinjoinOutputspByAcct = jest.fn(
    () => () => Promise.resolve(testCoinjoinSumByAcct)
  );
  mockSetCoinjoinCfg = ama.setCoinjoinCfg = jest.fn(() => () =>
    Promise.resolve(testCoinjoinSumByAcct)
  );
  mockRenameAccountAttempt = ca.renameAccountAttempt = jest.fn(() => () =>
    true
  );
  mockOnSendContinue = jest.fn(() => true);
});

test("test SetMixedAcctPage", async () => {
  render(<SetMixedAcctPage onSendContinue={mockOnSendContinue} />);
  expect(mockGetCoinjoinOutputspByAcct).toHaveBeenCalled();
  await wait(() => screen.getByText(/continue/i));
  expect(screen.getByText(/looks like you/i).textContent)
    .toMatchInlineSnapshot(`
    "Looks like you have accounts with coinjoin outputs. Past
                    account names cannot be restored during Recovery, so it is not
                    possible to know which account was the mix account. You can
                    set a mix and unmix account now or this can be done later on
                    the privacy page.
                    
                    With this action the chosen accounts will be renamed."
  `);

  const mixedAccountCheckboxes = screen.getAllByLabelText(/set mixed account/i);
  const changeAccountCheckboxes = screen.getAllByLabelText(
    /set change account/i
  );

  expect(mixedAccountCheckboxes.length).toBe(testCoinjoinSumByAcct.length);
  expect(changeAccountCheckboxes.length).toBe(testCoinjoinSumByAcct.length);
  const continueButton = screen.getByText(/continue/i);
  expect(continueButton.className).toMatch(/disabled/i);

  fireEvent.click(mixedAccountCheckboxes[0]);
  await wait(() => expect(mixedAccountCheckboxes[0].checked).toEqual(true));

  // can not check the same account for change as for mixed
  fireEvent.click(changeAccountCheckboxes[0]);
  await wait(() => expect(changeAccountCheckboxes[0].checked).toEqual(false));
  expect(
    screen.getByText(/you need to set/i).textContent
  ).toMatchInlineSnapshot(
    `"You need to set a mixed and change account and they can not be the same"`
  );

  // Click on another account for change account
  fireEvent.click(changeAccountCheckboxes[1]);
  await wait(() => expect(changeAccountCheckboxes[1].checked).toEqual(true));

  // can not check the same account for mixed as for change
  fireEvent.click(mixedAccountCheckboxes[1]);
  await wait(() => expect(mixedAccountCheckboxes[0].checked).toEqual(true));
  await wait(() => expect(mixedAccountCheckboxes[1].checked).toEqual(false));

  // Click on another account for mixed account
  fireEvent.click(mixedAccountCheckboxes[2]);
  await wait(() => expect(mixedAccountCheckboxes[0].checked).toEqual(false));
  await wait(() => expect(mixedAccountCheckboxes[2].checked).toEqual(true));
  expect(screen.queryByText(/you need to set/i)).not.toBeInTheDocument();

  expect(continueButton.className).not.toMatch(/disabled/i);
  user.click(continueButton);
  expect(mockRenameAccountAttempt).toHaveBeenCalledWith(
    testCoinjoinSumByAcct[1].acctIdx,
    CHANGE_ACCOUNT
  );
  expect(mockRenameAccountAttempt).toHaveBeenCalledWith(
    testCoinjoinSumByAcct[2].acctIdx,
    MIXED_ACCOUNT
  );
  expect(mockSetCoinjoinCfg).toHaveBeenCalledWith({
    changeNumber: testCoinjoinSumByAcct[1].acctIdx,
    mixedNumber: testCoinjoinSumByAcct[2].acctIdx
  });
  expect(mockOnSendContinue).toHaveBeenCalled();
});

test("test when getCoinjoinOutputspByAcct rejected", () => {
  mockGetCoinjoinOutputspByAcct = ama.getCoinjoinOutputspByAcct = jest.fn(
    () => () => Promise.reject()
  );
  render(<SetMixedAcctPage onSendContinue={mockOnSendContinue} />);
  expect(mockGetCoinjoinOutputspByAcct).toHaveBeenCalled();
  expect(screen.queryByText(/continue/i)).not.toBeInTheDocument();
});
