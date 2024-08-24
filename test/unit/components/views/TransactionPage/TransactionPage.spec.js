import TransactionPage from "components/views/TransactionPage";
import { render } from "test-utils.js";
import { screen, waitFor } from "@testing-library/react";
import { DCR, TestNetParams } from "constants";
import * as sel from "selectors";
import * as clia from "actions/ClientActions";
import * as ca from "actions/ControlActions";
import * as wl from "wallet";
import * as ta from "actions/TransactionActions";
import { cloneDeep } from "fp";
import {
  mockNormalizedRegularTransactions,
  mockNormalizedStakeTransactions,
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
const transactionActions = ta;

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
    feetxhash: "test-feetxhash",
    treasurypolicy: {
      testPiKey1: "yes",
      testPiKey2: "no"
    },
    tspendpolicy: {
      testHash1: "yes",
      testHash2: "no"
    }
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
  mockAbandonTransactionAttempt = clientActions.abandonTransactionAttempt =
    jest.fn(() => () => {});
  mockPublishUnminedTransactionsAttempt =
    controlActions.publishUnminedTransactionsAttempt = jest.fn(() => () => {});
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
  transactionActions.getTransactions = jest.fn(() => () => {});
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
const getToAddressText = (isMulti) =>
  screen.getByText(isMulti ? "To addresses:" : "To address:").parentElement
    .textContent;
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
  const rawTx = mockNormalizedRegularTransactions[mockTxHash].rawTx;

  const { user } = render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: mockNormalizedRegularTransactions,
        stakeTransactions: {},
        decodedTransactions: {}
      }
    }
  });

  await waitFor(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("out");
  expect(getTitleText()).toMatch("-8.00000 DCR");

  expect(getSentFromText()).toMatch("Sent FromdefaultUnconfirmed");
  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(getPending()).toBeInTheDocument();
  expect(getToAddressText(true)).toMatch(
    "To addresses: TsacvMFSMWcmxT7dj5UHqgrxB3PP6uwnEtY  TsZJt5A55AcCMp8iBu1rkNCxqJ3Bf1MC8Zk"
  );
  expect(getTransactionFeeText()).toMatch("Transaction fee:0.0000253 DCR");

  await user.click(getAbandonTransactionButton());
  expect(mockAbandonTransactionAttempt).toHaveBeenCalledWith(mockTxHash);

  await user.click(getRebroadcastTransaction());
  expect(mockPublishUnminedTransactionsAttempt).toHaveBeenCalled();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault17.9385434 DCR");
  // don't have any non wallet input
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch("Wallet Outputschange9.9385181 DCR");
  // don't have any non wallet input
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet OutputsTsZJt5A55AcCMp8iBu1rkNCxqJ3Bf1MC8ZkTsZJt5A55...3Bf1MC8Zk8.00000 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(queryHeight()).not.toBeInTheDocument(); // not mined

  await user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("regular received mined tx to the default account", async () => {
  mockTxHash =
    "642e3756be5a38636dfcdc643da9c6f5be8c9a1015b4623ad9cab38ff0ceec8e";
  const rawTx = mockNormalizedRegularTransactions[mockTxHash].rawTx;

  selectors.currentBlockHeight = jest.fn(() => 712214);
  const { user } = render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: mockNormalizedRegularTransactions,
        stakeTransactions: {},
        decodedTransactions: {}
      }
    }
  });

  await waitFor(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("in");
  expect(getTitleText()).toMatch("100.00000 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryPending()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed5,269 confirmations");
  expect(getToAddressText(true)).toMatch(
    "To addresses: TsVzSRzExt1NRzGwTqu8qyY12t8NH8yiGzV  TsbvHMveM1bTK35aP5Dd2tmFppipvw2faWA"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  // don't have any wallet input
  expect(getWalletInputsText()).toMatch("Wallet Inputs");
  expect(getNonWalletInputsText()).toMatch(
    "Non Wallet Inputs3e68d75f9c2dbdcc3dd3e68fca736835e8d802a732938e17c3dad6b58faa28bf:13e68d75f9...faa28bf:13.00000 DCRaed4058ec3b9849d58b032768b6bd78ffe635b35fe230d7022b6ee7af7f319db:0aed4058ec...7f319db:01.20000 DCR19d0afa8310eed1f3112e028c7bed798b7f1b9aff41f1e8eb76d37a86439f96b:119d0afa83...439f96b:11.00000 DCR14b5c15ec10861110b6a45eeb5d392b11b41e389c557ef32568b4718c0152778:014b5c15ec...0152778:0388.51673938 DCR"
  );

  expect(getWalletOutputs()).toMatch("Wallet Outputsdefault100.00000 DCR");
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet OutputsTsbvHMveM1bTK35aP5Dd2tmFppipvw2faWATsbvHMveM...ipvw2faWA293.71666428 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height706945");

  await user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("regular self transfer tx to unmixed account", async () => {
  mockTxHash =
    "9110b998c418a9007389627bc2ad51e888392f463bc7ccc30dcd927a2f0fa304";
  const rawTx = mockNormalizedRegularTransactions[mockTxHash].rawTx;

  selectors.currentBlockHeight = jest.fn(() => 712836);
  const { user } = render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: mockNormalizedRegularTransactions,
        stakeTransactions: {},
        decodedTransactions: {}
      }
    }
  });

  await waitFor(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("self");
  expect(getTitleText()).toMatch("-0.0000253 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryPending()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed4 confirmations");
  expect(getToAddressText(true)).toMatch(
    "To addresses: TsSBV4qZpZHS6QGVi6Zkp8kxBMS8EEF1bCh  TsgdFQemirW9EcAuz94SUCTePPaj5TDEcf8"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault63.62443956 DCR");
  // don't have any non wallet input
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch(
    "Wallet Outputsaccount-450.00000 DCRdefault13.62441426 DCR"
  );
  // don't have any non wallet input
  expect(getNonWalletOutputs()).toMatch("Non Wallet Outputs");

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height712832");

  await user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("self coins from unmixed to mixed account", async () => {
  mockTxHash =
    "ee6dbff0efe2eeb8c803133284462849661709beab258fb57453997afd9f492c";
  const rawTx = mockNormalizedRegularTransactions[mockTxHash].rawTx;

  selectors.currentBlockHeight = jest.fn(() => 712883);
  const { user } = render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: mockNormalizedRegularTransactions,
        stakeTransactions: {},
        decodedTransactions: {}
      }
    }
  });

  await waitFor(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("mixed");
  expect(getTitleText()).toMatch("-0.0000361 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryPending()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed11 confirmations");
  expect(getToAddressText(true)).toMatch(
    "To addresses: TshTsuJmLsbpFCPgFYkeR4nmbRqiAAjGvAR  TsUNW19FJpNjkGrsi1tusvkHYNoZVbvzLTY  TsfhYupZxcqyHMLmJDUZ9qLJxbD6VQkpriC  TsXPm8qFAc1niDd654jaJnRsSSWjBTKGmP5  TsjBaeiu9ZZC2aZ5d4wHRH9H8KeG4szwkEs  TsjwBN1UELsLfV6BZynGfH21qhyBb5PtFaw  TsoPFWy8h8DFKiXXqYxWUaS9uguazs1bzva  TsVV7XBX2B8hj8c76FzWByoZ622DTiQxXUm  TsoQB5qSKdNXJEwr2X5YbUJnBhHaPYv2pA3"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch("Wallet Inputsaccount-450.00000 DCR");
  expect(getNonWalletInputsText()).toMatch(
    "Non Wallet Inputs1fb0d31823836168b59ea0d52d301905aa8c64c694b528e22e901d5b3cac7377:61fb0d3182...cac7377:614.04694804 DCR1fb0d31823836168b59ea0d52d301905aa8c64c694b528e22e901d5b3cac7377:131fb0d3182...ac7377:1316.50200823 DCR"
  );

  expect(getWalletOutputs()).toMatch(
    "Wallet Outputschange7.05029094 DCRchange10.73741824 DCRchange10.73741824 DCRchange10.73741824 DCRchange10.73741824 DCR"
  );
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet OutputsTsjwBN1UELsLfV6BZynGfH21qhyBb5PtFawTsjwBN1UE...yBb5PtFaw5.76456469 DCRTsoPFWy8h8DFKiXXqYxWUaS9uguazs1bzvaTsoPFWy8h...uazs1bzva10.73741824 DCRTsVV7XBX2B8hj8c76FzWByoZ622DTiQxXUmTsVV7XBX2...2DTiQxXUm3.3095045 DCRTsoQB5qSKdNXJEwr2X5YbUJnBhHaPYv2pA3TsoQB5qSK...HaPYv2pA310.73741824 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height712872");

  await user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("voted ticket", async () => {
  mockTxHash =
    "6085cffd75245c4d2ae51c8dbe4651e54addc30693b016e8e061720589714f57";
  const rawTx = mockNormalizedStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] =
    mockNormalizedStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 924414);

  const { user } = render(<TransactionPage />, {
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

  await waitFor(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("ticket");
  expect(getTitleText()).toMatch("Ticket, Voted");
  expect(getTicketCostText()).toMatch("Ticket Cost122.71678363 DCR");
  expect(getRewardText()).toMatch("Reward0.04586488 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryUnconfirmed()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed4,572 confirmations");
  expect(getToAddressText(true)).toMatch(
    "To addresses: TsZU4vitduHQ4JWY5hjXFpqWa4DmUsaLenU  TsYefqPSd4tBj2MFBaFirMhPK8hUUhMfa4n  TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2 "
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch(
    "Wallet Inputsaccount-15122.71681343 DCR"
  );
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch("Wallet Outputsdefault122.71678363 DCR");
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet OutputsTsYefqPSd4tBj2MFBaFirMhPK8hUUhMfa4nTsYefqPSd...hUUhMfa4n0.00000 DCRTsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2TsR28UZRp...hrNVvbYq20.00000 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height919842");

  await user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();

  expect(getVSPHostText()).toMatch("VSP host:mockVspHost-votedticket");
});

test("vote tx", async () => {
  mockTxHash =
    "843128b4209be24400f5c7452aad43c2a7592979fcce6de22695e501c6a4d3b4";
  const rawTx = mockNormalizedStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] =
    mockNormalizedStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 934699);

  const { user } = render(<TransactionPage />, {
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

  await waitFor(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("vote");
  expect(getTitleText()).toMatch("Vote");
  expect(getTicketCostText()).toMatch("Ticket Cost67.85796485 DCR");
  expect(getRewardText()).toMatch("Reward0.04320506 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryUnconfirmed()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed1,962 confirmations");
  expect(getTicketSpentText()).toMatch(
    "Ticket Spent:65c1f46ce10d2bf2595de367ab8d1703162bb47d47f40fb550ecf9ec5d21ed60"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault67.85796485 DCR");
  expect(getNonWalletInputsText()).toMatch(
    "Non Wallet InputsStakebase0.04323486 DCR"
  );

  expect(getWalletOutputs()).toMatch("Wallet Outputsaccount-1567.90119971 DCR");
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet Outputs[script] - OP_RETURN OP_DATA_36 e4d5021f882b7926497679f68b14dbf77fdd2a901b24560ab297789e00000000803b0e00[script] ...0803b0e000.00000 DCR[script] - OP_RETURN OP_DATA_6 01000a000000[script] ...00a0000000.00000 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height932737");

  await user.click(screen.getByText("Back"));
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
    "843128b4209be24400f5c7452aad43c2a7592979fcce6de22695e501c6a4d3b4";
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] =
    mockNormalizedStakeTransactions[mockTxHash];
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

  await waitFor(() => getIODetails());

  expect(screen.getByText("Agenda Choices:").parentNode.textContent).toMatch(
    "Agenda Choices:Change maximum treasury expenditure policy as defined in DCP0007reverttreasurypolicyabstainEnable explicit version upgrades as defined in DCP0008explicitverupgradesabstainEnable automatic ticket revocations as defined in DCP0009autorevocationsabstainChange block reward subsidy split to 10/80/10 as defined in DCP0010changesubsidysplitabstainThis doesn't align with what the wallet currently has set (yes)"
  );
});

test("missed ticket", async () => {
  mockTxHash =
    "30dd06049d763ab474dbc39ffbe4bbd0ad6825e5bdf21b67dc046fda3ce55774";
  const rawTx = mockNormalizedStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] =
    mockNormalizedStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 930680);
  const { user } = render(<TransactionPage />, {
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

  await waitFor(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("missed");
  expect(getTitleText()).toMatch("Missed");
  expect(getTicketCostText()).toMatch("Ticket Cost95.25589786 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryUnconfirmed()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed372,256 confirmations");
  expect(getToAddressText(true)).toMatch(
    "To addresses: TccM3W31vkNXUCosK4Y5vYrmtiWWjuecHFs  TsZRAVD9t8shxck66daNEhaWrWCsYV9e2Qp  TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2 "
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch(
    "Wallet Inputsaccount-695.25592746 DCR"
  );
  // don't have non wallet input
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch("Wallet Outputsimported95.25589786 DCR");
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet OutputsTsZRAVD9t8shxck66daNEhaWrWCsYV9e2QpTsZRAVD9t...CsYV9e2Qp0.00000 DCRTsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2TsR28UZRp...hrNVvbYq20.00000 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height558424");
  expect(getVSPHostText()).toMatch("VSP host:mockVspHost-missed");

  await user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("revocation", async () => {
  mockTxHash =
    "c1092ece233a5f25ab5c9510a5c0fc16cfd036d9f4c9f32ee5c7ea8ca3886e8c";
  const rawTx = mockNormalizedStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] =
    mockNormalizedStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 712217);

  const { user } = render(<TransactionPage />, {
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

  await waitFor(() => getIODetails());

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

  expect(getWalletOutputs()).toMatch("Wallet Outputsdefault64.75413336 DCR");
  // don't have non wallet output
  expect(getNonWalletOutputs()).toMatch("Non Wallet Outputs");

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height697812");

  await user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("revocation", async () => {
  mockTxHash =
    "c1092ece233a5f25ab5c9510a5c0fc16cfd036d9f4c9f32ee5c7ea8ca3886e8c";
  const rawTx = mockNormalizedStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] =
    mockNormalizedStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 712217);

  const { user } = render(<TransactionPage />, {
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

  await waitFor(() => getIODetails());

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

  expect(getWalletOutputs()).toMatch("Wallet Outputsdefault64.75413336 DCR");
  // don't have non wallet output
  expect(getNonWalletOutputs()).toMatch("Non Wallet Outputs");

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height697812");

  await user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("revoked ticket", async () => {
  mockTxHash =
    "b04ee2e3309a85d0d147e942b8139c3d6f36daf086ce0fd4d53a9069dfa97f99";
  const rawTx = mockNormalizedStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] =
    mockNormalizedStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 924414);

  const { user } = render(<TransactionPage />, {
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

  await waitFor(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("ticket");
  expect(getTitleText()).toMatch("Ticket, Revoked");
  expect(getTicketCostText()).toMatch("Ticket Cost86.00218109 DCR");
  expect(getRewardText()).toMatch("Reward-0.0000298 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryUnconfirmed()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed109,009 confirmations");
  expect(getToAddressText(true)).toMatch(
    "To addresses: TsnHm1YjaLMmnFsyGwt54D4P53aFaNqeESJ  Tse3z6zJhWhb5Eir4s7KjZRv4koC9fEkAYy  TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault86.00221089 DCR");
  // don't have non wallet input
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch("Wallet Outputsdefault86.00218109 DCR");
  // don't have non wallet output
  expect(getNonWalletOutputs()).toMatch("Non Wallet Outputs");

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height815405");

  await user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("immature ticket", async () => {
  mockTxHash =
    "f0085fbc5f7476dc4907618262ae6e8a967ab1ac21c55465ed1dc31369dec530";
  const rawTx = mockNormalizedStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] =
    mockNormalizedStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 930691);

  const { user } = render(<TransactionPage />, {
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

  await waitFor(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("immature");
  expect(getTitleText()).toMatch("Immature");
  expect(getTicketCostText()).toMatch("Ticket Cost67.85796485 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryUnconfirmed()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed1 confirmation");
  expect(getToAddressText(true)).toMatch(
    "To addresses: TsSSWJRNEor8X6R33GSoo68p3yq3zFuGoVK  TsTP4a61273kCXL9ZDgRKZsPrV6Emh3nxB7  TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault67.85799465 DCR");
  // don't have non wallet input
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch("Wallet Outputsdefault67.85796485 DCR");
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet OutputsTsTP4a61273kCXL9ZDgRKZsPrV6Emh3nxB7TsTP4a612...6Emh3nxB70.00000 DCRTsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2TsR28UZRp...hrNVvbYq20.00000 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height930690");
  expect(getVSPHostText()).toMatch("VSP host:mockVspHost-immature");

  await user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("live ticket", async () => {
  mockTxHash =
    "05fba7101e0d038bad81777f221189eebce9461d1181d961a284f32ed3664e07";
  const rawTx = mockNormalizedStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] =
    mockNormalizedStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 931147);

  const { user } = render(<TransactionPage />, {
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

  await waitFor(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("ticket");
  expect(getTitleText()).toMatch("Live");
  expect(getTicketCostText()).toMatch("Ticket Cost67.85796485 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(queryUnconfirmed()).not.toBeInTheDocument();
  expect(getConfirmedText()).toMatch("Confirmed451 confirmations");
  expect(getToAddressText(true)).toMatch(
    "To addresses: TscyVUMxevtGhTuTvM6LkLnvQGU97kEyUg4  TsRBbeBi7cpeoKsMEtzDDi2isLT6ETX8o2p  TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2"
  );

  expect(queryAbandonTransactionButton()).not.toBeInTheDocument();
  expect(queryRebroadcastTransaction()).not.toBeInTheDocument();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault67.85799465 DCR");
  // don't have non wallet input
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch("Wallet Outputsdefault67.85796485 DCR");
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet OutputsTsRBbeBi7cpeoKsMEtzDDi2isLT6ETX8o2pTsRBbeBi7...T6ETX8o2p0.00000 DCRTsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2TsR28UZRp...hrNVvbYq20.00000 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(getHeightText()).toMatch("Height930696");
  expect(getVSPHostText()).toMatch("VSP host:mockVspHost-live");

  await user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();

  // fetch VSP Ticket Status

  const fetchVSPTicketStatusBt = screen.getByRole("button", {
    name: "Fetch VSP Ticket Status"
  });
  await user.click(fetchVSPTicketStatusBt);

  //cancel first
  await user.click(screen.getByRole("button", { name: "Cancel" }));
  await user.click(fetchVSPTicketStatusBt);

  const testPassphrase = "test-pass";
  await user.type(screen.getByLabelText("Private Passphrase"), testPassphrase);

  await user.click(screen.getByRole("button", { name: "Continue" }));

  await waitFor(() => screen.getByText("Fee tx hash:"));

  expect(screen.getByText("Fee tx hash:").parentNode.textContent).toMatch(
    `Fee tx hash:${mockVSPTicketInfoResponse.data.feetxhash}`
  );
  expect(screen.getByText("Fee tx status:").parentNode.textContent).toMatch(
    `Fee tx status:${mockVSPTicketInfoResponse.data.feetxstatus}`
  );
  expect(screen.getByText("Treasury Policy:").parentNode.textContent).toMatch(
    `Treasury Policy:testPiKey1${mockVSPTicketInfoResponse.data.treasurypolicy.testPiKey1}testPiKey2${mockVSPTicketInfoResponse.data.treasurypolicy.testPiKey2}`
  );
  expect(screen.getByText("TSpend Policy:").parentNode.textContent).toMatch(
    `TSpend Policy:testHash1${mockVSPTicketInfoResponse.data.tspendpolicy.testHash1}testHash2${mockVSPTicketInfoResponse.data.tspendpolicy.testHash2}`
  );
  expect(mockSignMessageAttempt).toHaveBeenCalled();
  expect(mockGetVSPTicketStatus).toHaveBeenCalled();
});

test("unmined ticket", async () => {
  mockTxHash =
    "d6b457b87edf02391e9adb4021d830259178bc4c906129b55445f2918ad5fb6f";
  const rawTx = mockNormalizedStakeTransactions[mockTxHash].rawTx;
  const mockStakeTransactionMap = {};
  mockStakeTransactionMap[mockTxHash] =
    mockNormalizedStakeTransactions[mockTxHash];
  selectors.currentBlockHeight = jest.fn(() => 712277);

  const { user } = render(<TransactionPage />, {
    initialState: {
      grpc: {
        regularTransactions: {},
        stakeTransactions: mockStakeTransactionMap,
        decodedTransactions: {}
      }
    }
  });

  await waitFor(() => getIODetails());

  expect(getHeaderTitleIconClassName()).toMatch("unmined");
  expect(getTitleText()).toMatch("Unmined");
  expect(getPending()).toBeInTheDocument();
  expect(getUnconfirmed()).toBeInTheDocument();
  expect(getTicketCostText()).toMatch("Ticket Cost0.20000 DCR");

  expect(getTransactionText()).toMatch(`Transaction:${mockTxHash}`);
  expect(getToAddressText(true)).toMatch(
    "To addresses: TsRWjysgoNXTS7JAQXfsaAzts8UM3Dq3WUg  TseGZ7HkiWybyH6LnKdokifkFCn4cJYddm4  TsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2 "
  );

  await user.click(getAbandonTransactionButton());
  expect(mockAbandonTransactionAttempt).toHaveBeenCalledWith(mockTxHash);

  await user.click(getRebroadcastTransaction());
  expect(mockPublishUnminedTransactionsAttempt).toHaveBeenCalled();

  expect(getWalletInputsText()).toMatch("Wallet Inputsdefault0.2000298 DCR");
  // don't have non wallet input
  expect(getNonWalletInputsText()).toMatch("Non Wallet Inputs");

  expect(getWalletOutputs()).toMatch("Wallet Outputsdefault0.20000 DCR");
  expect(getNonWalletOutputs()).toMatch(
    "Non Wallet OutputsTseGZ7HkiWybyH6LnKdokifkFCn4cJYddm4TseGZ7Hki...n4cJYddm40.00000 DCRTsR28UZRprhgQQhzWns2M6cAwchrNVvbYq2TsR28UZRp...hrNVvbYq20.00000 DCR"
  );

  expect(screen.getByText(rawTx)).toBeInTheDocument();
  expect(queryHeight()).not.toBeInTheDocument(); // not mined
  expect(getVSPHostText()).toMatch("VSP host:mockVspHost-unmined");

  await user.click(screen.getByText("Back"));
  expect(mockGoBackHistory).toHaveBeenCalled();
});

test("show not yet fetched regular tx", async () => {
  mockTxHash = "not-yet-fetched-tx-hash";

  const mockGetTransactionsResponse = {
    type: transactionActions.GETTRANSACTIONS_COMPLETE,
    getStakeTxsAux: { noMoreTransactions: false },
    getRegularTxsAux: { noMoreTransactions: false },
    stakeTransactions: {},
    regularTransactions: {},
    startRequestHeight: 0
  };

  let counter = 0;
  transactionActions.getTransactions = jest.fn(() => (dispatch) => {
    if (counter++ > 3) {
      mockGetTransactionsResponse.regularTransactions[mockTxHash] = {
        ...mockNormalizedRegularTransactions[
          "9110b998c418a9007389627bc2ad51e888392f463bc7ccc30dcd927a2f0fa304"
        ],
        txHash: mockTxHash
      };
    }
    return dispatch(mockGetTransactionsResponse);
  });

  render(<TransactionPage />, {
    initialState: {
      grpc: {
        ticketsFilter: {
          listDirection: "desc",
          status: null,
          vspFeeStatus: null
        },
        transactionsFilter: {
          search: null,
          listDirection: "desc",
          types: [],
          directions: [],
          maxAmount: null,
          minAmount: null
        },
        regularTransactions: {},
        stakeTransactions: {},
        decodedTransactions: {},
        getRegularTxsAux: {
          noMoreTransactions: false
        },
        getStakeTxsAux: {
          noMoreTransactions: false
        }
      }
    }
  });

  await waitFor(() => getIODetails());
});

test("show not yet fetched stake tx", async () => {
  mockTxHash =
    "05fba7101e0d038bad81777f221189eebce9461d1181d961a284f32ed3664e07";

  const mockGetTransactionsResponse = {
    type: transactionActions.GETTRANSACTIONS_COMPLETE,
    getStakeTxsAux: { noMoreTransactions: false },
    getRegularTxsAux: { noMoreTransactions: false },
    stakeTransactions: {},
    regularTransactions: {},
    startRequestHeight: 0
  };

  let counter = 0;
  transactionActions.getTransactions = jest.fn(() => (dispatch) => {
    if (counter++ > 3) {
      mockGetTransactionsResponse.stakeTransactions[mockTxHash] =
        mockNormalizedStakeTransactions[mockTxHash];
    }
    return dispatch(mockGetTransactionsResponse);
  });

  render(<TransactionPage />, {
    initialState: {
      grpc: {
        ticketsFilter: {
          listDirection: "desc",
          status: null,
          vspFeeStatus: null
        },
        transactionsFilter: {
          search: null,
          listDirection: "desc",
          types: [],
          directions: [],
          maxAmount: null,
          minAmount: null
        },
        regularTransactions: {},
        stakeTransactions: {},
        decodedTransactions: {},
        getRegularTxsAux: {
          noMoreTransactions: false
        },
        getStakeTxsAux: {
          noMoreTransactions: false
        }
      }
    }
  });

  await waitFor(() => getIODetails());
});

test("show not yet fetched stake tx (won't find it)", async () => {
  mockTxHash = "not-yet-fetched-tx-hash";

  const mockGetTransactionsResponse = {
    type: transactionActions.GETTRANSACTIONS_COMPLETE,
    getStakeTxsAux: { noMoreTransactions: false },
    getRegularTxsAux: { noMoreTransactions: false },
    stakeTransactions: {},
    regularTransactions: {},
    startRequestHeight: 0
  };

  let counter = 0;
  transactionActions.getTransactions = jest.fn(() => (dispatch) => {
    if (counter++ > 3) {
      mockGetTransactionsResponse.getStakeTxsAux.noMoreTransactions = true;
    }
    if (counter++ > 5) {
      mockGetTransactionsResponse.getRegularTxsAux.noMoreTransactions = true;
    }
    return dispatch(mockGetTransactionsResponse);
  });

  render(<TransactionPage />, {
    initialState: {
      grpc: {
        ticketsFilter: {
          listDirection: "desc",
          status: null,
          vspFeeStatus: null
        },
        transactionsFilter: {
          search: null,
          listDirection: "desc",
          types: [],
          directions: [],
          maxAmount: null,
          minAmount: null
        },
        regularTransactions: {},
        stakeTransactions: {},
        decodedTransactions: {},
        getRegularTxsAux: {
          noMoreTransactions: false
        },
        getStakeTxsAux: {
          noMoreTransactions: false
        }
      }
    }
  });

  await waitFor(() => screen.getByText("Transaction not found"));
});
