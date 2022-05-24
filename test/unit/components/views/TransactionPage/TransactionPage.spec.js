import TransactionPage from "components/views/TransactionPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, wait } from "@testing-library/react";
import { DCR, TestNetParams } from "constants";
import * as sel from "selectors";
import * as clia from "actions/ClientActions";
import * as ca from "actions/ControlActions";
import * as wl from "wallet";
import { cloneDeep } from "fp";
import {
  mockRegularTransactions,
  mockStakeTransactions,
  mockOldTxs,
  mockAgendas
} from "./mocks.js";
import {
  mockMixedAccountValue,
  mockChangeAccountValue,
  mockMixedAccount
} from "../TicketsPage/PurchaseTab/mocks";
import { defaultMockAvailableMainnetVsps } from "../../../actions/vspMocks";

const selectors = sel;
const clientActions = clia;
const controlActions = ca;
const wallet = wl;

let mockTxHash = "";
const testCurrentBlockHeight = 709245;

let mockAbandonTransactionAttempt;
let mockPublishUnminedTransactionsAttempt;
let mockGoBackHistory;
let mockGetVSPTicketStatus;
let mockSignMessageAttempt;

const mockVSPTicketInfoResponse = {
  data: {
    feetxstatus: "broadcasted",
    feetxhash: "test-feetxhash"
  }
};
const mockSig = "mock-sig";
const mockAvailableMainnetVspsPubkeys = cloneDeep(
  defaultMockAvailableMainnetVsps
).map((v) => ({ ...v, pubkey: `${v.host}-pubkey` }));

beforeEach(() => {
  selectors.isTestNet = jest.fn(() => true);
  selectors.chainParams = jest.fn(() => TestNetParams);
  selectors.currencyDisplay = jest.fn(() => DCR);
  selectors.allAgendas = jest.fn(() => mockAgendas);
  selectors.voteChoices = jest.fn(() => {});
  selectors.spendingAccounts = jest.fn(() => [mockMixedAccount]);
  selectors.visibleAccounts = jest.fn(() => [mockMixedAccount]);
  selectors.getMixedAccount = jest.fn(() => mockMixedAccountValue);
  selectors.getChangeAccount = jest.fn(() => mockChangeAccountValue);
  selectors.defaultSpendingAccount = jest.fn(() => mockMixedAccount);
  selectors.getAvailableVSPsPubkeys = jest.fn(
    () => mockAvailableMainnetVspsPubkeys
  );
  mockAbandonTransactionAttempt = clientActions.abandonTransactionAttempt = jest.fn(
    () => () => {}
  );
  mockPublishUnminedTransactionsAttempt = controlActions.publishUnminedTransactionsAttempt = jest.fn(
    () => () => {}
  );
  mockGoBackHistory = clientActions.goBackHistory = jest.fn(() => () => {});
  selectors.currentBlockHeight = jest.fn(() => testCurrentBlockHeight);
  wallet.getTransaction = jest.fn((_, txHash) => {
    const mockOldTx = mockOldTxs.find((tx) => tx.txHash === txHash);
    if (!mockOldTx) {
      throw Error("item does not exist");
    }
    return mockOldTx;
  });

  mockGetVSPTicketStatus = wallet.getVSPTicketStatus = jest.fn(() =>
    Promise.resolve(mockVSPTicketInfoResponse)
  );
  mockSignMessageAttempt = controlActions.signMessageAttempt = jest.fn(
    () => () => mockSig
  );

  wallet.processManagedTickets = jest.fn(() => () => {});
  wallet.getVSPTicketsByFeeStatus = jest.fn(() =>
    Promise.resolve({ ticketHashes: [] })
  );
});
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    txHash: mockTxHash
  })
}));

const getAbandonTransactionButton = () =>
  screen.getByRole("button", { name: "Abandon Transaction" });
const queryAbandonTransactionButton = () =>
  screen.queryByRole("button", { name: "Abandon Transaction" });
const getRebroadcastTransaction = () =>
  screen.getByRole("button", { name: "Rebroadcast Transaction" });
const queryRebroadcastTransaction = () =>
  screen.queryByRole("button", { name: "Rebroadcast Transaction" });
const getIODetails = () => screen.getByText("I/O Details");
const getHeaderTitleIconClassName = () =>
  screen.getByTestId("title-header-icon").className;
const getTitleText = () => screen.getByTestId("title-header").textContent;
const getConfirmedText = () =>
  screen.getByText("Confirmed").parentElement.parentElement.textContent;
const getSentFromText = () =>
  screen.getByText("Sent From").parentElement.textContent;
const getTransactionText = () =>
  screen.getByText("Transaction:").parentElement.textContent;
const getTicketSpentText = () =>
  screen.getByText("Ticket Spent:").parentElement.textContent;
const getVSPHostText = () =>
  screen.getByText("VSP host:").parentElement.textContent;
const getLastBlockValidText = () =>
  screen.getByText("Last Block Valid:").parentElement.textContent;
const getVoteVersionText = () =>
  screen.getByText("Vote Version:").parentElement.textContent;
const getVoteBitsText = () =>
  screen.getByText("Vote Bits:").parentElement.textContent;
const getPending = () => screen.getByText("Pending");
const getUnconfirmed = () => screen.getByText("Unconfirmed");
const queryUnconfirmed = () => screen.queryByText("Unconfirmed");
const queryPending = () => screen.queryByText("Pending");
const getToAddressText = () =>
  screen.getByText("To address:").parentElement.textContent;
const getTransactionFeeText = () =>
  screen.getByText("Transaction fee:").parentElement.textContent;
const getWalletInputsText = () =>
  screen.getByText("Wallet Inputs").parentElement.textContent;
const getNonWalletInputsText = () =>
  screen.getByText("Non Wallet Inputs").parentElement.textContent;
const getWalletOutputs = () =>
  screen.getByText("Wallet Outputs").parentElement.textContent;
const getNonWalletOutputs = () =>
  screen.getByText("Non Wallet Outputs").parentElement.textContent;
const queryHeight = () => screen.queryByText("Height");
const getHeightText = () =>
  screen.getByText("Height").parentElement.textContent;
const getTicketCostText = () =>
  screen.getByText("Ticket Cost").parentElement.textContent;
const getRewardText = () =>
  screen.getByText("Reward").parentElement.textContent;

test("regular sent pending tx from default account to an external address", async () => {
  mockTxHash =
    "263f64a32f2f86ffda747242cfc620b0c42689f5c600ef2be22351f53bcd5b0d";
  const rawTx = mockRegularTransactions[mockTxHash].rawTx;

  render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: mockRegularTransactions,
        stakeTransactions: {},
        decodedTransactions: {},
        getAccountsResponse: {
          accountsList: [
            {
              accountNumber: 0,
              accountName: "default"
            }
          ]
        }
      }
    }
  });

  await wait(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("out");
  expect(getTitleText()).toMatch("-8.00000 DCR");

  expect(getSentFromText()).toMatch("Sent FromdefaultUnconfirmed");
  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(getPending()).toBeInTheDocument();
  expect(getToAddressText()).toMatch(
    "To address: TsacvMFSMWcmxT7dj5UHqgrxB3PP6uwnEtY  TsZJt5A55AcCMp8iBu1rkNCxqJ3Bf1MC8Zk"
  );
  expect(getTransactionFeeText()).toMatch("Transaction fee:0.0000253 DCR");

  user.click(getAbandonTransactionButton());
  expect(mockAbandonTransactionAttempt).toHaveBeenCalledWith(mockTxHash);

  user.click(getRebroadcastTransaction());
  expect(mockPublishUnminedTransactionsAttempt).toHaveBeenCalled();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault17.9385434 DCR");
  // don't have any non wallet input
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch("Wallet Outputschange9.9385181 DCR");
  // don't have any non wallet input
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet Outputs TsZJt5A55AcCMp8iBu1rkNCxqJ3Bf1MC8Zk 8.00000 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(queryHeight()).not.toBeInTheDocument(); // not mined

  user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("regular received mined tx to the default account", async () => {
  mockTxHash =
    "642e3756be5a38636dfcdc643da9c6f5be8c9a1015b4623ad9cab38ff0ceec8e";
  const rawTx = mockRegularTransactions[mockTxHash].rawTx;

  selectors.currentBlockHeight = jest.fn(() => 712214);
  render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: mockRegularTransactions,
        stakeTransactions: {},
        decodedTransactions: {},
        getAccountsResponse: {
          accountsList: [
            {
              accountNumber: 0,
              accountName: "default"
            }
          ]
        }
      }
    }
  });

  await wait(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("in");
  expect(getTitleText()).toMatch("100.00000 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryPending()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed5,269 confirmations");
  expect(getToAddressText()).toMatch(
    "To address: TsVzSRzExt1NRzGwTqu8qyY12t8NH8yiGzV  TsbvHMveM1bTK35aP5Dd2tmFppipvw2faWA"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  // don't have any wallet input
  expect(getWalletInputsText()).toMatch("Wallet Inputs");
  expect(getNonWalletInputsText()).toMatch(
    "Non Wallet Inputs 3e68d75f9c2dbdcc3dd3e68fca736835e8d802a732938e17c3dad6b58faa28bf:1 3.00000 DCR aed4058ec3b9849d58b032768b6bd78ffe635b35fe230d7022b6ee7af7f319db:0 1.20000 DCR 19d0afa8310eed1f3112e028c7bed798b7f1b9aff41f1e8eb76d37a86439f96b:1 1.00000 DCR 14b5c15ec10861110b6a45eeb5d392b11b41e389c557ef32568b4718c0152778:0 388.51673938 DCR"
  );

  expect(getWalletOutputs()).toMatch("Wallet Outputs default 100.00000 DCR");
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet Outputs TsbvHMveM1bTK35aP5Dd2tmFppipvw2faWA 293.71666428 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height706945");

  user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("regular self transfer tx to unmixed account", async () => {
  mockTxHash =
    "9110b998c418a9007389627bc2ad51e888392f463bc7ccc30dcd927a2f0fa304";
  const rawTx = mockRegularTransactions[mockTxHash].rawTx;

  selectors.currentBlockHeight = jest.fn(() => 712836);
  render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: mockRegularTransactions,
        stakeTransactions: {},
        decodedTransactions: {},
        getAccountsResponse: {
          accountsList: [
            {
              accountNumber: 0,
              accountName: "default"
            },
            {
              accountNumber: 4,
              accountName: "unmixed"
            }
          ]
        }
      }
    }
  });

  await wait(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("self");
  expect(getTitleText()).toMatch("-0.0000253 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryPending()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed4 confirmations");
  expect(getToAddressText()).toMatch(
    "To address: TsSBV4qZpZHS6QGVi6Zkp8kxBMS8EEF1bCh  TsgdFQemirW9EcAuz94SUCTePPaj5TDEcf8"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault63.62443956 DCR");
  // don't have any non wallet input
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch(
    "Wallet Outputs unmixed 50.00000 DCR default 13.62441426 DCR"
  );
  // don't have any non wallet input
  expect(getNonWalletOutputs()).toMatch("Non Wallet Outputs");

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height712832");

  user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("self coins from unmixed to mixed account", async () => {
  mockTxHash =
    "ee6dbff0efe2eeb8c803133284462849661709beab258fb57453997afd9f492c";
  const rawTx = mockRegularTransactions[mockTxHash].rawTx;

  selectors.currentBlockHeight = jest.fn(() => 712883);
  render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: mockRegularTransactions,
        stakeTransactions: {},
        decodedTransactions: {},
        getAccountsResponse: {
          accountsList: [
            {
              accountNumber: 0,
              accountName: "default"
            }
          ]
        }
      }
    }
  });

  await wait(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("mixed");
  expect(getTitleText()).toMatch("-0.0000361 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryPending()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed11 confirmations");
  expect(getToAddressText()).toMatch(
    "To address: TshTsuJmLsbpFCPgFYkeR4nmbRqiAAjGvAR  TsUNW19FJpNjkGrsi1tusvkHYNoZVbvzLTY  TsfhYupZxcqyHMLmJDUZ9qLJxbD6VQkpriC  TsXPm8qFAc1niDd654jaJnRsSSWjBTKGmP5  TsjBaeiu9ZZC2aZ5d4wHRH9H8KeG4szwkEs  TsjwBN1UELsLfV6BZynGfH21qhyBb5PtFaw  TsoPFWy8h8DFKiXXqYxWUaS9uguazs1bzva  TsVV7XBX2B8hj8c76FzWByoZ622DTiQxXUm  TsoQB5qSKdNXJEwr2X5YbUJnBhHaPYv2pA3"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch("Wallet Inputs50.00000 DCR");
  expect(getNonWalletInputsText()).toMatch(
    "Non Wallet Inputs 1fb0d31823836168b59ea0d52d301905aa8c64c694b528e22e901d5b3cac7377:6 14.04694804 DCR 1fb0d31823836168b59ea0d52d301905aa8c64c694b528e22e901d5b3cac7377:13 16.50200823 DCR"
  );

  expect(getWalletOutputs()).toMatch(
    "Wallet Outputschange7.05029094 DCRchange10.73741824 DCRchange10.73741824 DCRchange10.73741824 DCRchange10.73741824 DCR"
  );
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet Outputs TsjwBN1UELsLfV6BZynGfH21qhyBb5PtFaw 5.76456469 DCR TsoPFWy8h8DFKiXXqYxWUaS9uguazs1bzva 10.73741824 DCR TsVV7XBX2B8hj8c76FzWByoZ622DTiQxXUm 3.3095045 DCR TsoQB5qSKdNXJEwr2X5YbUJnBhHaPYv2pA3 10.73741824 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height712872");

  user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("voted ticket", async () => {
  mockTxHash =
    "6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57";
  const rawTx = mockStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] = mockStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 924414);

  render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: {},
        stakeTransactions: mockStakeTransactionMap,
        decodedTransactions: {},
        getAccountsResponse: {
          accountsList: [
            {
              accountNumber: 0,
              accountName: "default"
            }
          ]
        }
      }
    },
    currentSettings: {
      network: "testnet"
    }
  });

  await wait(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("ticket");
  expect(getTitleText()).toMatch("Ticket, Voted");
  expect(getTicketCostText()).toMatch("Ticket Cost122.71678363 DCR");
  expect(getRewardText()).toMatch("Reward0.04586488 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryUnconfirmed()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed4,572 confirmations");

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault122.71678363 DCR");
  expect(getNonWalletInputsText()).toMatch(
    "Non Wallet Inputs 92ce48f17cf6a507f401a45d60ecd819443c6246f2f0e366b5614631032e0fb5:0 122.71681343 DCR"
  );

  expect(getWalletOutputs()).toMatch("Wallet Outputs default 122.76267831 DCR");
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet Outputs TsZU4vitduHQ4JWY5hjXFpqWa4DmUsaLenU 122.71678363 DCR TsYefqPSd4tBj2MFBaFirMhPK8hUUhMfa4n 0.00000 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height919842");

  user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();

  expect(getVSPHostText()).toMatch("VSP host:mockVspHost");
});

test("vote tx", async () => {
  mockTxHash =
    "fbde49cea3a4f27110aed317dff2e8c2f00d44550bce68f5ef182b1d356d79da";
  const rawTx = mockStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] = mockStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 924414);

  render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: {},
        stakeTransactions: mockStakeTransactionMap,
        decodedTransactions: {},
        getAccountsResponse: {
          accountsList: [
            {
              accountNumber: 0,
              accountName: "default"
            }
          ]
        }
      }
    },
    currentSettings: {
      network: "testnet"
    }
  });

  await wait(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("vote");
  expect(getTitleText()).toMatch("Vote");
  expect(getTicketCostText()).toMatch("Ticket Cost122.71678363 DCR");
  expect(getRewardText()).toMatch("Reward0.04586488 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryUnconfirmed()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed4,437 confirmations");
  expect(getTicketSpentText()).toMatch(
    "Ticket Spent:6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault122.71678363 DCR");
  expect(getNonWalletInputsText()).toMatch(
    "Non Wallet Inputs 0000000000000000000000000000000000000000000000000000000000000000:4294967295 0.04589468 DCR"
  );

  expect(getWalletOutputs()).toMatch("Wallet Outputs default 122.76267831 DCR");
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet Outputs [script] - OP_RETURN OP_DATA_36 32c8b01145a24d62ff8db613ca24a3b92e2472bac893ad0e864f1c8b00000000a8090e00 0.00000 DCR [script] - OP_RETURN OP_DATA_6 01000a000000 0.00000 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height919977");

  user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();

  expect(screen.getByText("Agenda Choices:").parentNode.textContent).toMatch(
    "Agenda Choices:Change maximum treasury expenditure policy as defined in DCP0007reverttreasurypolicyabstainEnable explicit version upgrades as defined in DCP0008explicitverupgradesabstainEnable automatic ticket revocations as defined in DCP0009autorevocationsabstainChange block reward subsidy split to 10/80/10 as defined in DCP0010changesubsidysplitabstain"
  );

  expect(getVSPHostText()).toMatch("VSP host:mockVspHost");
  expect(getLastBlockValidText()).toMatch("Last Block Valid:true");
  expect(getVoteVersionText()).toMatch("Vote Version:10");
  expect(getVoteBitsText()).toMatch("Vote Bits:0x0001");
});

test("vote tx (votes don't align with what the wallet currently has set)", async () => {
  mockTxHash =
    "fbde49cea3a4f27110aed317dff2e8c2f00d44550bce68f5ef182b1d356d79da";
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] = mockStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 712217);
  selectors.voteChoices = jest.fn(() => [
    {
      agendaId: "changesubsidysplit",
      choiceId: "yes"
    }
  ]);

  render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: {},
        stakeTransactions: mockStakeTransactionMap,
        decodedTransactions: {},
        getAccountsResponse: {
          accountsList: [
            {
              accountNumber: 0,
              accountName: "default"
            }
          ]
        }
      }
    },
    currentSettings: {
      network: "testnet"
    }
  });

  await wait(() => getIODetails());

  expect(screen.getByText("Agenda Choices:").parentNode.textContent).toMatch(
    "Agenda Choices:Change maximum treasury expenditure policy as defined in DCP0007reverttreasurypolicyabstainEnable explicit version upgrades as defined in DCP0008explicitverupgradesabstainEnable automatic ticket revocations as defined in DCP0009autorevocationsabstainChange block reward subsidy split to 10/80/10 as defined in DCP0010changesubsidysplitabstainThis doesn't align with what the wallet currently has set (yes)"
  );
});

test("missed ticket", async () => {
  mockTxHash =
    "d9916343ec3817801ab63f44b5d3fbf637e3045f0293e99ed0f2954286dd7ad4";
  const rawTx = mockStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] = mockStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 712217);
  render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: {},
        stakeTransactions: mockStakeTransactionMap,
        decodedTransactions: {},
        getAccountsResponse: {
          accountsList: [
            {
              accountNumber: 0,
              accountName: "default"
            }
          ]
        }
      }
    }
  });

  await wait(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("missed");
  expect(getTitleText()).toMatch("Missed");
  expect(getTicketCostText()).toMatch("Ticket Cost96.63775267 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryUnconfirmed()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed5,271 confirmations");
  expect(getToAddressText()).toMatch(
    "To address: TsZu7GLduXJKyD69vpuBrTj6Ja2sREAY1M1  TsTRP3GpMrtvRZ2XK5CopdZ9HhxsRJ75Cwn  TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault96.63778247 DCR");
  // don't have non wallet input
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch("Wallet Outputs default 96.63775267 DCR");
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet Outputs TsTRP3GpMrtvRZ2XK5CopdZ9HhxsRJ75Cwn 0.00000 DCR TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2 0.00000 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height706946");
  expect(getVSPHostText()).toMatch("VSP host:mockVspHost-missed");

  user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("revocation", async () => {
  mockTxHash =
    "c1092ece233a5f25ab5c9510a5c0fc16cfd036d9f4c9f32ee5c7ea8ca3886e8c";
  const rawTx = mockStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] = mockStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 712217);

  render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: {},
        stakeTransactions: mockStakeTransactionMap,
        decodedTransactions: {},
        getAccountsResponse: {
          accountsList: [
            {
              accountNumber: 0,
              accountName: "default"
            }
          ]
        }
      }
    }
  });

  await wait(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("revocation");
  expect(getTitleText()).toMatch("Revocation");
  expect(getTicketCostText()).toMatch("Ticket Cost64.75415536 DCR");
  expect(getRewardText()).toMatch("Reward-0.0000518 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryUnconfirmed()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed14,405 confirmations");
  expect(getToAddressText()).toMatch(
    "To address: Tsic4BsFzDL1jhR4LTbWS8LvGFgxjqFG3pU"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault64.75415536 DCR");
  // don't have non wallet input
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch("Wallet Outputs default 64.75413336 DCR");
  // don't have non wallet output
  expect(getNonWalletOutputs()).toMatch("Non Wallet Outputs");

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height697812");

  user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("revoked ticket", async () => {
  mockTxHash =
    "b04ee2e3309a85d0d147e942b8139c3d6f36daf086ce0fd4d53a9069dfa97f99";
  const rawTx = mockStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] = mockStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 924414);

  render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: {},
        stakeTransactions: mockStakeTransactionMap,
        decodedTransactions: {},
        getAccountsResponse: {
          accountsList: [
            {
              accountNumber: 0,
              accountName: "default"
            }
          ]
        }
      }
    }
  });

  await wait(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("ticket");
  expect(getTitleText()).toMatch("Ticket, Revoked");
  expect(getTicketCostText()).toMatch("Ticket Cost86.00218109 DCR");
  expect(getRewardText()).toMatch("Reward-0.0000298 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryUnconfirmed()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed109,009 confirmations");
  expect(getToAddressText()).toMatch(
    "To address: Tse3z6zJhWhb5Eir4s7KjZRv4koC9fEkAYy  Tse3z6zJhWhb5Eir4s7KjZRv4koC9fEkAYy  TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault86.00218109 DCR");
  // don't have non wallet input
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch("Wallet Outputs default 86.00218109 DCR");
  // don't have non wallet output
  expect(getNonWalletOutputs()).toMatch("Non Wallet Outputs");

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height815405");

  user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("immature ticket", async () => {
  mockTxHash =
    "7d6d36b1ee3edc40941aadfab51a8b179d166a0612300742c0e39e60fac16872";
  const rawTx = mockStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] = mockStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 712277);

  render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: {},
        stakeTransactions: mockStakeTransactionMap,
        decodedTransactions: {},
        getAccountsResponse: {
          accountsList: [
            {
              accountNumber: 0,
              accountName: "default"
            }
          ]
        }
      }
    }
  });

  await wait(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("immature");
  expect(getTitleText()).toMatch("Immature");
  expect(getTicketCostText()).toMatch("Ticket Cost37.31114774 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryUnconfirmed()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed12 confirmations");
  expect(getToAddressText()).toMatch(
    "To address: TscNc4DXrcuFgFJ6WyohhKaqvyDyJ8pksUU  TsVa9jpZGjAg1oqHBsUbrEtFbQjv9rUjVfj  TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault37.31117754 DCR");
  // don't have non wallet input
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch("Wallet Outputs default 37.31114774 DCR");
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet Outputs TsVa9jpZGjAg1oqHBsUbrEtFbQjv9rUjVfj 0.00000 DCR TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2 0.00000 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height712265");
  expect(getVSPHostText()).toMatch("VSP host:mockVspHost-immature");

  user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("live ticket", async () => {
  mockTxHash =
    "7d6d36b1ee3edc40941aadfab51a8b179d166a0612300742c0e39e60fac16873";
  const rawTx = mockStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] = mockStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 712277);

  render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: {},
        stakeTransactions: mockStakeTransactionMap,
        decodedTransactions: {},
        getAccountsResponse: {
          accountsList: [
            {
              accountNumber: 0,
              accountName: "default"
            }
          ]
        }
      }
    }
  });

  await wait(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("ticket");
  expect(getTitleText()).toMatch("Live");
  expect(getTicketCostText()).toMatch("Ticket Cost37.31114774 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryUnconfirmed()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed12 confirmations");
  expect(getToAddressText()).toMatch(
    "To address: TscNc4DXrcuFgFJ6WyohhKaqvyDyJ8pksUU  TsVa9jpZGjAg1oqHBsUbrEtFbQjv9rUjVfj  TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault37.31117754 DCR");
  // don't have non wallet input
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch("Wallet Outputs default 37.31114774 DCR");
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet Outputs TsVa9jpZGjAg1oqHBsUbrEtFbQjv9rUjVfj 0.00000 DCR TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2 0.00000 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height712265");
  expect(getVSPHostText()).toMatch("VSP host:mockVspHost-live");

  user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();

  // fetch VSP Ticket Status

  const fetchVSPTicketStatusBt = screen.getByRole("button", {
    name: "Fetch VSP Ticket Status"
  });
  user.click(fetchVSPTicketStatusBt);

  //cancel first
  user.click(screen.getByRole("button", { name: "Cancel" }));
  user.click(fetchVSPTicketStatusBt);

  const testPassphrase = "test-pass";
  user.type(screen.getByLabelText("Private Passphrase"), testPassphrase);

  user.click(screen.getByRole("button", { name: "Continue" }));

  await wait(() => screen.getByText("Fee tx hash:"));

  expect(screen.getByText("Fee tx hash:").parentNode.textContent).toMatch(
    `Fee tx hash:${mockVSPTicketInfoResponse.data.feetxhash}`
  );
  expect(screen.getByText("Fee tx status:").parentNode.textContent).toMatch(
    `Fee tx status:${mockVSPTicketInfoResponse.data.feetxstatus}`
  );
  expect(mockSignMessageAttempt).toHaveBeenCalled();
  expect(mockGetVSPTicketStatus).toHaveBeenCalled();
});

test("unmined ticket", async () => {
  mockTxHash =
    "7d6d36b1ee3edc40941aadfab51a8b179d166a0612300742c0e39e60fac16874";
  const rawTx = mockStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] = mockStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 712277);

  render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: {},
        stakeTransactions: mockStakeTransactionMap,
        decodedTransactions: {},
        getAccountsResponse: {
          accountsList: [
            {
              accountNumber: 0,
              accountName: "default"
            }
          ]
        }
      }
    }
  });

  await wait(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("unmined");
  expect(getTitleText()).toMatch("Unmined");
  expect(getPending()).toBeInTheDocument();
  expect(getUnconfirmed()).toBeInTheDocument();
  expect(getTicketCostText()).toMatch("Ticket Cost37.31114774 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(getToAddressText()).toMatch(
    "To address: TscNc4DXrcuFgFJ6WyohhKaqvyDyJ8pksUU  TsVa9jpZGjAg1oqHBsUbrEtFbQjv9rUjVfj  TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2"
  );

  user.click(getAbandonTransactionButton());
  expect(mockAbandonTransactionAttempt).toHaveBeenCalledWith(mockTxHash);

  user.click(getRebroadcastTransaction());
  expect(mockPublishUnminedTransactionsAttempt).toHaveBeenCalled();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault37.31117754 DCR");
  // don't have non wallet input
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch("Wallet Outputs default 37.31114774 DCR");
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet Outputs TsVa9jpZGjAg1oqHBsUbrEtFbQjv9rUjVfj 0.00000 DCR TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2 0.00000 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(queryHeight()).not.toBeInTheDocument(); // not mined
  expect(getVSPHostText()).toMatch("VSP host:mockVspHost-unmined");

  user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});
