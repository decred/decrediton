import ResendVotesToRecentlyUpdatedVSPs from "components/views/GetStartedPage/SetupWallet/ResendVotesToRecentlyUpdatedVSPs";
import { render } from "test-utils.js";
import { screen, wait } from "@testing-library/react";
import user from "@testing-library/user-event";
import * as sel from "selectors";
import * as vspa from "actions/VSPActions";
const selectors = sel;
const vspActions = vspa;

const mockCancel = jest.fn(() => {});
const mockSend = jest.fn(() => {});
const mockVSPs = [
  {
    host: "test-host-1",
    tickets: ["test-ticket-hash-1"]
  },
  {
    host: "test-host-2",
    tickets: ["test-ticket-hash-2", "test-ticket-hash-22"]
  },
  {
    host: "test-host-3",
    tickets: [
      "test-ticket-hash-3",
      "test-ticket-hash-32",
      "test-ticket-hash-33"
    ]
  }
];

const mockVotes = [
  {
    agendaId: "reverttreasurypolicy",
    choiceId: "abstain"
  },
  {
    agendaId: "explicitverupgrades",
    choiceId: "yes"
  },
  {
    agendaId: "autorevocations",
    choiceId: "no"
  }
];
const testPrivatePassphrase = "test-private-passphrase";
let mockResendVSPDVoteChoices;

beforeEach(() => {
  selectors.resendVSPDVoteChoicesAttempt = jest.fn(() => false);
  mockResendVSPDVoteChoices = vspActions.resendVSPDVoteChoices = jest.fn(
    () => () => Promise.resolve()
  );
});

const getSkipButton = () => screen.getByRole("button", { name: "Skip" });
const querySkipButton = () => screen.queryByRole("button", { name: "Skip" });
const getContinueButton = () =>
  screen.getByRole("button", { name: "Continue" });
const getAllContinueButton = () =>
  screen.getAllByRole("button", { name: "Continue" });
const queryContinueButton = () =>
  screen.queryByRole("button", { name: "Continue" });
const getDescLabel = () => screen.getByText(/> 0 unspent tickets/i);
const getVSPListHeader = () => screen.getByText(/Recently upgraded VSP/i);
const getVoteListHeader = () =>
  screen.getByText("Votes to be resent:").nextSibling;
const getCancelButton = () => screen.getByRole("button", { name: "Cancel" });
const getPrivatePassphraseInput = () =>
  screen.getByLabelText("Private Passphrase");
const queryPrivatePassphraseInput = () =>
  screen.queryByLabelText("Private Passphrase");

test("skip ResendVotesToRecentlyUpdatedVSPs", () => {
  render(
    <ResendVotesToRecentlyUpdatedVSPs cancel={mockCancel} vsps={mockVSPs} />
  );
  user.click(getSkipButton());
  expect(mockCancel).toHaveBeenCalled();
});

test("resendVSPDVoteChoicesAttempt is true, form is in loading state", () => {
  selectors.resendVSPDVoteChoicesAttempt = jest.fn(() => true);
  render(<ResendVotesToRecentlyUpdatedVSPs vsps={mockVSPs} />);
  expect(querySkipButton()).not.toBeInTheDocument();
  expect(queryContinueButton()).not.toBeInTheDocument();
  // loading countine button
  expect(screen.getByRole("button", { disabled: true })).toBeInTheDocument();
});

test("test resend votes", async () => {
  render(
    <ResendVotesToRecentlyUpdatedVSPs
      send={mockSend}
      vsps={mockVSPs}
      votes={mockVotes}
    />
  );

  // vsp list
  const VSPListHeader = getVSPListHeader();
  expect(VSPListHeader.textContent).toMatchInlineSnapshot(
    '"Recently upgraded VSPs:"'
  );
  expect(getDescLabel().textContent).toMatchInlineSnapshot(
    '"The following VSPs are upgraded recently and they have > 0 unspent tickets. Since the most recent vote preference update was prior to the upgrading, you need to resend the vote preferences."'
  );
  expect(VSPListHeader.nextSibling.childNodes.length).toBe(mockVSPs.length);
  expect(VSPListHeader.nextSibling.childNodes[0].textContent).toBe(
    `${mockVSPs[0].host} (1 unspent ticket)`
  );
  expect(VSPListHeader.nextSibling.childNodes[1].textContent).toBe(
    `${mockVSPs[1].host} (2 unspent tickets)`
  );
  expect(VSPListHeader.nextSibling.childNodes[2].textContent).toBe(
    `${mockVSPs[2].host} (3 unspent tickets)`
  );

  // votes list
  const voteListHeader = getVoteListHeader();
  expect(voteListHeader.childNodes.length).toBe(mockVotes.length);
  expect(voteListHeader.childNodes[0].textContent).toBe(
    `${mockVotes[0].agendaId}:${mockVotes[0].choiceId}`
  );
  expect(voteListHeader.childNodes[1].textContent).toBe(
    `${mockVotes[1].agendaId}:${mockVotes[1].choiceId}`
  );
  expect(voteListHeader.childNodes[2].textContent).toBe(
    `${mockVotes[2].agendaId}:${mockVotes[2].choiceId}`
  );

  const continueButton = getContinueButton();
  user.click(continueButton);
  expect(getPrivatePassphraseInput()).toBeInTheDocument();

  // cancel first
  user.click(getCancelButton());
  expect(queryPrivatePassphraseInput()).not.toBeInTheDocument();

  // continue again
  user.click(continueButton);
  expect(getPrivatePassphraseInput()).toBeInTheDocument();
  const continuePassphraseButton = getAllContinueButton()[1];
  expect(continuePassphraseButton.disabled).toBeTruthy();
  user.type(getPrivatePassphraseInput(), testPrivatePassphrase);
  expect(continuePassphraseButton.disabled).toBeFalsy();
  user.click(continuePassphraseButton);
  expect(queryPrivatePassphraseInput()).not.toBeInTheDocument();

  expect(mockResendVSPDVoteChoices).toHaveBeenCalledWith(
    mockVSPs,
    testPrivatePassphrase
  );
  await wait(() => expect(mockSend).toHaveBeenCalledWith({ type: "CONTINUE" }));
});

test("check label when there is just one vsp", () => {
  render(
    <ResendVotesToRecentlyUpdatedVSPs
      send={mockSend}
      vsps={[mockVSPs[0]]}
      votes={mockVotes}
    />
  );

  // vsp list
  const VSPListHeader = getVSPListHeader();
  expect(VSPListHeader.textContent).toMatchInlineSnapshot(
    '"Recently upgraded VSP:"'
  );
  expect(getDescLabel().textContent).toMatchInlineSnapshot(
    '"The following VSP is upgraded recently and it has > 0 unspent tickets. Since the most recent vote preference update was prior to the upgrading, you need to resend the vote preferences."'
  );
});

test("test resend votes failed", async () => {
  const resendVSPDVoteChoicesError = "test-resend-error";
  mockResendVSPDVoteChoices = vspActions.resendVSPDVoteChoices = jest.fn(
    () => () => Promise.reject(resendVSPDVoteChoicesError)
  );
  render(
    <ResendVotesToRecentlyUpdatedVSPs
      send={mockSend}
      vsps={mockVSPs}
      votes={mockVotes}
    />
  );

  // continue again
  user.click(getContinueButton());
  expect(getPrivatePassphraseInput()).toBeInTheDocument();
  const continuePassphraseButton = getAllContinueButton()[1];
  user.type(getPrivatePassphraseInput(), testPrivatePassphrase);
  user.click(continuePassphraseButton);
  expect(queryPrivatePassphraseInput()).not.toBeInTheDocument();

  expect(mockResendVSPDVoteChoices).toHaveBeenCalledWith(
    mockVSPs,
    testPrivatePassphrase
  );
  await wait(() =>
    expect(mockSend).toHaveBeenCalledWith({
      type: "ERROR",
      error: resendVSPDVoteChoicesError
    })
  );
});
