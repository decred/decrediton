import {
  compose,
  reduce,
  filter,
  get,
  not,
  or,
  and,
  eq,
  bool,
  map,
  apply,
  some,
  createSelectorEager as createSelector
} from "./fp";
import { appLocaleFromElectronLocale } from "./i18n/locales";
import { reverseHash, reverseRawHash } from "./helpers/byteActions";
import { MainNetParams, TestNetParams } from "constants";
import { decodeVoteScript } from "./helpers/tickets";
import {
  EXTERNALREQUEST_STAKEPOOL_LISTING,
  EXTERNALREQUEST_POLITEIA,
  EXTERNALREQUEST_DCRDATA
} from "main_dev/externalRequests";
import {
  POLITEIA_URL_TESTNET,
  POLITEIA_URL_MAINNET
} from "./middleware/politeiaapi";
import {
  DCRDATA_URL_TESTNET,
  DCRDATA_URL_MAINNET
} from "./middleware/dcrdataapi";
import { isMixTx, dateToLocal, dateToUTC } from "./helpers";
import {
  MIN_RELAY_FEE,
  DCR,
  ATOMS,
  UNIT_DIVISOR,
  TESTNET,
  MAINNET,
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TICKET_FEE,
  MIXED,
  VOTED,
  LIVE,
  UNMINED,
  IMMATURE
} from "constants";
import * as wallet from "wallet";
import { VSP_FEE_PROCESS_ERRORED } from "./constants/Decrediton";

const EMPTY_ARRAY = []; // Maintaining identity (will) improve performance;

export const theme = get(["settings", "currentSettings", "theme"]);
// Daemon startup selectors
export const daemonError = get(["daemon", "daemonError"]);
export const walletError = get(["daemon", "walletError"]);
export const appVersion = get(["daemon", "appVersion"]);
export const updateAvailable = get(["daemon", "updateAvailable"]);
export const isDaemonRemote = get(["daemon", "daemonRemote"]);
export const getDaemonStarted = get(["daemon", "daemonStarted"]);
export const getCurrentBlockCount = get(["daemon", "currentBlockCount"]);
export const getNeededBlocks = get(["daemon", "neededBlocks"]);
export const getEstimatedTimeLeft = get(["daemon", "timeLeftEstimate"]);
export const getDaemonSynced = get(["daemon", "daemonSynced"]);
export const getWalletReady = get(["daemon", "walletReady"]);
export const getSyncAttemptRequest = get([
  "walletLoader",
  "syncAttemptRequest"
]);

// general startup selector
export const setLanguage = get(["daemon", "setLanguage"]);
export const showTutorial = get(["daemon", "tutorial"]);
export const showPrivacy = get(["daemon", "showPrivacy"]);
export const showSpvChoice = get(["daemon", "showSpvChoice"]);
export const daemonWarning = get(["daemon", "daemonWarning"]);
export const versionInvalid = get(["version", "versionInvalid"]);
export const requiredWalletRPCVersion = get(["version", "requiredVersion"]);
export const walletRPCVersion = createSelector(
  [get(["version", "getWalletRPCVersionResponse"])],
  (r) => (r ? r.getVersionString() : null)
);
export const getVersionServiceError = get([
  "version",
  "getVersionServiceError"
]);
export const getWalletRPCVersionError = get([
  "version",
  "getWalletRPCVersionError"
]);
export const getLoaderError = get(["version", "getLoaderError"]);
export const versionInvalidError = createSelector(
  [versionInvalid, get(["version", "versionInvalidError"])],
  (invalid, error) => (invalid ? error || "Unknown Error" : null)
);

// rpc or spv dcrwallet sync selectors
export const syncInput = get(["walletLoader", "syncInput"]);
export const peerCount = get(["walletLoader", "peerCount"]);
export const synced = get(["walletLoader", "synced"]);
export const syncFetchMissingCfiltersAttempt = get([
  "walletLoader",
  "syncFetchMissingCfiltersAttempt"
]);
export const syncFetchMissingCfiltersStart = get([
  "walletLoader",
  "syncFetchMissingCfiltersStart"
]);
export const syncFetchMissingCfiltersEnd = get([
  "walletLoader",
  "syncFetchMissingCfiltersEnd"
]);
export const syncFetchHeadersAttempt = get([
  "walletLoader",
  "syncFetchHeadersAttempt"
]);
export const syncFetchHeadersCount = get([
  "walletLoader",
  "syncFetchHeadersCount"
]);
export const syncFetchHeadersLastHeaderTime = get([
  "walletLoader",
  "syncLastFetchedHeaderTime"
]);
export const syncDiscoverAddressesAttempt = get([
  "walletLoader",
  "syncDiscoverAddressesAttempt"
]);
export const syncRescanAttempt = get(["walletLoader", "syncRescanAttempt"]);
export const syncFetchHeadersComplete = get([
  "walletLoader",
  "syncFetchHeadersComplete"
]);
export const syncFetchTimeStart = get(["walletLoader", "syncFetchTimeStart"]);
export const getPrivacyEnabled = get(["walletLoader", "privacyEnabled"]);
export const getAllowSendFromUnmixed = get([
  "walletLoader",
  "allowSendFromUnmixed"
]);
// getMixedAccount gets the account number (int) which represents the mixed
// account at decrediton.
export const getMixedAccount = get(["walletLoader", "mixedAccount"]);
// getChangeAccount get the changeaccount selector, which is used for unmixed
// accounts on mixer.
export const getChangeAccount = get(["walletLoader", "changeAccount"]);
export const getCsppServer = get(["walletLoader", "csppServer"]);
export const getCsppPort = get(["walletLoader", "csppPort"]);
export const getMixedAccountBranch = get([
  "walletLoader",
  "mixedAccountBranch"
]);

export const getMixedAccountSpendableBalance = get([
  "grpc",
  "mixedAccountSpendableBalance"
]);
export const getChangeAccountSpendableBalance = get([
  "grpc",
  "changeAccountSpendableBalance"
]);

const availableWallets = get(["daemon", "availableWallets"]);
const availableWalletsSelect = createSelector([availableWallets], (wallets) =>
  map(
    (wallet) => ({
      label: wallet.wallet + " (" + wallet.network + ")",
      value: wallet,
      network: wallet.network,
      finished: wallet.finished,
      isWatchingOnly: wallet.watchingOnly,
      lastAccess: wallet.lastAccess ? new Date(wallet.lastAccess) : null
    }),
    wallets
  )
);
export const sortedAvailableWallets = createSelector(
  [availableWalletsSelect],
  (availableWallets) =>
    availableWallets.sort((a, b) => b.lastAccess - a.lastAccess)
);
export const previousWallet = get(["daemon", "previousWallet"]);
export const getWalletName = get(["daemon", "walletName"]);
export const getSelectedWallet = get(["walletLoader", "selectedWallet"]);

export const balances = or(get(["grpc", "balances"]), () => []);

// dcrwallet grpc services
export const walletService = get(["grpc", "walletService"]);
export const agendaService = get(["grpc", "agendaService"]);
export const votingService = get(["grpc", "votingService"]);
export const accountMixerService = get(["grpc", "accountMixerService"]);

// TODO review selectors that are not being used anymore.
export const getBalanceRequestAttempt = get([
  "grpc",
  "getBalanceRequestAttempt"
]);
export const getAccountsResponse = get(["grpc", "getAccountsResponse"]);
export const getNetworkResponse = get(["grpc", "getNetworkResponse"]);
export const getNetworkError = get(["grpc", "getNetworkError"]);
export const getAccountMixerRunning = get(["grpc", "accountMixerRunning"]);
export const getAccountMixerError = get(["grpc", "mixerStreamerError"]);
export const getIsMixerDisabled = get(["grpc", "isMixerDisabled"]);
export const createMixerAccountAttempt = get([
  "grpc",
  "createMixerAccountAttempt"
]);

// accounts is a selector representing accountsList from gRPC response.
export const accounts = createSelector([getAccountsResponse], (r) =>
  r ? r.getAccountsList() : []
);

export const isWatchingOnly = bool(get(["walletLoader", "isWatchingOnly"]));
export const accountExtendedKey = createSelector(
  [get(["control", "getAccountExtendedKeyResponse"])],
  (response) => (response ? response.getAccExtendedPubKey() : null)
);
export const sortedAccounts = createSelector([balances], (balances) =>
  balances.slice().sort((a, b) => a.accountNumber - b.accountNumber)
);

export const totalBalance = createSelector(
  [balances],
  reduce((atoms, { total }) => atoms + total, 0)
);

export const spendableTotalBalance = createSelector(
  [balances],
  reduce(
    (total, { accountName, spendable }) =>
      accountName === "imported" ? total : total + spendable,
    0
  )
);

export const getMixedAccountName = createSelector(
  [getMixedAccount, balances],
  (mixedAcc, balances) =>
    !mixedAcc
      ? null
      : balances
        .filter(({ accountNumber }) => accountNumber === mixedAcc)
        .map(({ accountName }) => accountName)[0]
);

export const getChangeAccountName = createSelector(
  [getChangeAccount, balances],
  (changeAcc, balances) =>
    !changeAcc
      ? null
      : balances
        .filter(({ accountNumber }) => accountNumber === changeAcc)
        .map(({ accountName }) => accountName)[0]
);

// getNotMixedAccounts Is an array of all accountNumbers which is not the mixedaccount.
// this ways we can filter our mixedAccount to send transactions in privacy wallets.
// If allowSendFromUnmixed is enabled, it returns null.
export const getNotMixedAccounts = createSelector(
  [getMixedAccount, balances, getAllowSendFromUnmixed],
  (mixedAcc, balances) =>
    !mixedAcc
      ? []
      : balances
        .filter(({ accountNumber }) => accountNumber !== mixedAcc)
        .map(({ accountNumber }) => accountNumber)
);

// getNotMixedAcctIfAllowed checks if it is allowed to send from unmixed
// accounts and returns an empty array, if that's the case.
export const getNotMixedAcctIfAllowed = createSelector(
  [getNotMixedAccounts, getAllowSendFromUnmixed],
  (notMixedAccts, allowSendFromUnmixed) => {
    return !allowSendFromUnmixed ? notMixedAccts : [];
  }
);

export const lockedBalance = createSelector(
  [balances],
  reduce((atoms, { lockedByTickets }) => atoms + lockedByTickets, 0)
);

export const networks = () => [{ name: TESTNET }, { name: MAINNET }];
export const network = get(["settings", "currentSettings", "network"]);
export const isTestNet = compose(eq(TESTNET), network);
export const isMainNet = not(isTestNet);
export const firstBlockTime = compose(
  (isMainNet) =>
    isMainNet
      ? new Date("2016-02-08 18:00:00 UTC")
      : new Date("2018-08-06 00:00:00 UTC"),
  isMainNet
);
export const currencies = () => [{ name: DCR }, { name: ATOMS }];
export const needNetworkReset = get(["settings", "needNetworkReset"]);
export const currencyDisplay = get([
  "settings",
  "currentSettings",
  "currencyDisplay"
]);
export const unitDivisor = compose(
  (disp) => (disp === DCR ? UNIT_DIVISOR : 1),
  currencyDisplay
);
export const currentLocaleName = get(["settings", "currentSettings", "locale"]);
export const timezone = get(["settings", "currentSettings", "timezone"]);
export const defaultLocaleName = createSelector(
  [currentLocaleName],
  (currentLocaleName) => {
    return appLocaleFromElectronLocale(currentLocaleName);
  }
);
export const tsDate = compose(
  (timezone) => (timezone === "utc" ? dateToUTC : dateToLocal),
  timezone
);

export const isSPV = get(["settings", "currentSettings", "spvMode"]);
export const isAdvancedDaemon = get([
  "settings",
  "currentSettings",
  "daemonStartAdvanced"
]);

export const sortedLocales = createSelector([get(["locales"])], (locales) =>
  locales.sort((a, b) => a.description.localeCompare(b.description))
);
export const namedLocales = createSelector([get(["locales"])], (locales) =>
  reduce(
    (nl, l) => {
      nl[l.key] = l;
      return nl;
    },
    {},
    locales
  )
);
export const locale = createSelector(
  [namedLocales, currentLocaleName],
  (namedLocales, currentLocaleName) => {
    return namedLocales[currentLocaleName] || namedLocales["en"];
  }
);

export const txURLBuilder = createSelector([network], (network) => (txHash) =>
  `https://${network !== TESTNET ? "dcrdata" : "testnet"
  }.decred.org/tx/${txHash}`
);

export const blockURLBuilder = createSelector(
  [network],
  (network) => (txHash) =>
    `https://${network !== TESTNET ? "dcrdata" : "testnet"
    }.decred.org/block/${txHash}`
);

export const txOutURLBuilder = createSelector(
  [network],
  (network) => (txHash, outputIdx) =>
    `https://${network !== "testnet" ? "explorer" : network
    }.dcrdata.org/tx/${txHash}/out/${outputIdx}`
);

export const decodedTransactions = get(["grpc", "decodedTransactions"]);

export const chainParams = compose(
  (isTestNet) => (isTestNet ? TestNetParams : MainNetParams),
  isTestNet
);

export const ticketNormalizer = createSelector(
  [network, accounts, chainParams, txURLBuilder, blockURLBuilder],
  (network, accounts, chainParams, txURLBuilder, blockURLBuilder) => {
    return (ticket) => {
      const {
        txType,
        status,
        spender,
        blockHash,
        rawTx,
        isStake,
        timestamp,
        feeStatus
      } = ticket;
      // TODO refactor same code to be used in tickets and regular tx normalizers.
      const findAccount = (num) =>
        accounts.find((account) => account.getAccountNumber() === num);
      const getAccountName = (num) =>
        ((act) => (act ? act.getAccountName() : ""))(findAccount(num));
      const txInputs = [];
      const txOutputs = [];
      const hasSpender = spender && spender.getHash();
      const isVote = status === VOTED;
      const isPending = !timestamp;
      // Some legacy vsp fees wallet will have tickets without `ticket` field
      // and only with `spender` so we use it as fallback
      const ticketTx = ticket.ticket || ticket.spender;
      const ticketHash = reverseRawHash(ticketTx.getHash());
      const spenderTx = hasSpender ? spender : null;
      const txBlockHash = blockHash
        ? reverseHash(Buffer.from(blockHash).toString("hex"))
        : null;
      const txHash = ticket.txHash;
      const txUrl = txURLBuilder(txHash);
      const txBlockUrl = blockURLBuilder(txBlockHash);

      const spenderHash = hasSpender
        ? reverseHash(Buffer.from(spenderTx.getHash()).toString("hex"))
        : null;
      const hasCredits = ticketTx.getCreditsList().length > 0;
      if (spenderTx) {
        spenderTx.getDebitsList().reduce((total, debit) => {
          const debitedAccount = debit.getPreviousAccount();
          const debitedAccountName = getAccountName(debitedAccount);
          const amount = debit.getPreviousAmount();
          txInputs.push({
            accountName: debitedAccountName,
            amount,
            index: debit.getIndex()
          });
          return total + amount;
        }, 0);
        spenderTx.getCreditsList().forEach((credit) => {
          const amount = credit.getAmount();
          const address = credit.getAddress();
          const creditedAccount = credit.getAccount();
          const creditedAccountName = getAccountName(creditedAccount);
          txOutputs.push({
            accountName: creditedAccountName,
            amount,
            address,
            index: credit.getIndex()
          });
        });
      } else {
        ticketTx.getDebitsList().reduce((total, debit) => {
          const debitedAccount = debit.getPreviousAccount();
          const debitedAccountName = getAccountName(debitedAccount);
          const amount = debit.getPreviousAmount();
          txInputs.push({
            accountName: debitedAccountName,
            amount,
            index: debit.getIndex()
          });
          return total + amount;
        }, 0);

        ticketTx.getCreditsList().forEach((credit) => {
          const amount = credit.getAmount();
          const address = credit.getAddress();
          const creditedAccount = credit.getAccount();
          const creditedAccountName = getAccountName(creditedAccount);
          txOutputs.push({
            accountName: creditedAccountName,
            amount,
            address,
            index: credit.getIndex()
          });
        });
      }

      let ticketPrice = 0;
      if (hasCredits) {
        ticketPrice = ticketTx.getCreditsList()[0].getAmount();
      } else {
        // we don't have a credit when we don't have the voting rights (unimported
        // stakepool script, solo voting ticket, split ticket, etc)
        const decodedTicketTx = wallet.decodeRawTransaction(
          Buffer.from(ticketTx.getTransaction()),
          chainParams
        );
        ticketPrice = decodedTicketTx.outputs[0].value;
      }

      // ticket tx fee is the fee for the transaction where the ticket was bought
      const ticketTxFee = ticketTx.getFee();

      // revocations have a tx fee that influences the stake rewards calc
      const spenderTxFee = hasSpender ? spenderTx.getFee() : 0;

      // ticket change is anything returned to the wallet on ticket purchase.
      const isTicketChange = (c) => c.getIndex() > 0 && c.getIndex() % 2 === 0;
      const ticketChange = ticketTx
        .getCreditsList()
        .reduce((s, c) => (s + isTicketChange(c) ? c.getAmount() : 0), 0);

      // ticket investment is the full amount paid by the wallet on the ticket purchase
      let accountName = "";
      const debitList = ticketTx.getDebitsList();
      if (debitList.length > 0) {
        accountName = getAccountName(debitList[0].getPreviousAccount());
      }
      const ticketInvestment =
        debitList.reduce((a, v) => a + v.getPreviousAmount(), 0) - ticketChange;

      let ticketReward,
        ticketStakeRewards,
        ticketReturnAmount,
        ticketPoolFee,
        voteChoices;
      if (hasSpender) {
        // everything returned to the wallet after voting/revoking
        ticketReturnAmount = spenderTx
          .getCreditsList()
          .reduce((a, v) => a + v.getAmount(), 0);

        // this is liquid from applicable fees (i.e, what the wallet actually made)
        ticketReward = ticketReturnAmount - ticketInvestment;

        ticketStakeRewards = ticketReward / ticketInvestment;

        const decodedSpenderTx = wallet.decodeRawTransaction(
          Buffer.from(spenderTx.getTransaction()),
          chainParams
        );

        // Check pool fee. If there is a debit at index=0 of the ticket but not
        // a corresponding credit at the expected index on the spender, then
        // that was a pool fee.
        const hasIndex0Debit = ticketTx
          .getDebitsList()
          .some((d) => d.getIndex() === 0);
        const hasIndex0Credit = spenderTx.getCreditsList().some((c) => {
          // In votes, the first 2 outputs are voting block and vote bits
          // OP_RETURNs, so ignore those.
          return (
            (isVote && c.getIndex() === 2) || (!isVote && c.getIndex() === 0)
          );
        });
        if (hasIndex0Debit && !hasIndex0Credit) {
          const poolFeeDebit = ticketTx
            .getDebitsList()
            .find((d) => d.getIndex() === 0);
          ticketPoolFee = poolFeeDebit.getPreviousAmount();
        }

        if (isVote) {
          const voteScript = decodedSpenderTx.outputs[1].script;
          voteChoices = decodeVoteScript(network, voteScript);
        }
      }

      return {
        txHash,
        txBlockHash,
        spenderHash,
        ticketHash,
        ticketTx,
        spenderTx,
        ticketPrice,
        ticketReward,
        ticketChange,
        ticketInvestment,
        ticketTxFee,
        ticketPoolFee,
        ticketStakeRewards,
        ticketReturnAmount,
        voteChoices,
        spenderTxFee,
        enterTimestamp: ticketTx.getTimestamp(),
        leaveTimestamp: hasSpender ? spenderTx.getTimestamp() : null,
        status: ticket.status,
        rawTx,
        tx: ticketTx,
        txType,
        isPending,
        accountName,
        txInputs,
        txOutputs,
        txHeight: ticket.height,
        txUrl,
        txBlockUrl,
        isStake,
        feeStatus
      };
    };
  }
);

export const numTicketsToBuy = get(["control", "numTicketsToBuy"]);

// transactionNormalizer normalizes regular decred's regular transactions
export const transactionNormalizer = createSelector(
  [accounts, txURLBuilder, blockURLBuilder, chainParams, getMixedAccountName],
  (accounts, txURLBuilder, blockURLBuilder, chainParams, mixedAccountName) => {
    const findAccount = (num) =>
      accounts.find((account) => account.getAccountNumber() === num);
    const getAccountName = (num) =>
      ((act) => (act ? act.getAccountName() : ""))(findAccount(num));
    return (origTx) => {
      const {
        blockHash,
        tx,
        height,
        type,
        txType,
        timestamp,
        txHash,
        rawTx,
        outputs,
        creditAddresses
      } = origTx;
      const txUrl = txURLBuilder(txHash);
      const txBlockHash = blockHash
        ? reverseHash(Buffer.from(blockHash).toString("hex"))
        : null;
      const txBlockUrl = blockURLBuilder(txBlockHash);

      let totalFundsReceived = 0;
      let totalChange = 0;
      const txInputs = [];
      const txOutputs = [];
      const fee = tx.getFee();
      let debitedAccountName, creditedAccountName;
      const totalDebit = tx.getDebitsList().reduce((total, debit) => {
        const debitedAccount = debit.getPreviousAccount();
        debitedAccountName = getAccountName(debitedAccount);
        const amount = debit.getPreviousAmount();
        txInputs.push({
          accountName: debitedAccountName,
          amount,
          index: debit.getIndex()
        });
        return total + amount;
      }, 0);

      let selfTx = false;
      tx.getCreditsList().forEach((credit) => {
        const amount = credit.getAmount();
        const address = credit.getAddress();
        const creditedAccount = credit.getAccount();
        const currentCreditedAccountName = getAccountName(creditedAccount);
        // If we find a self credited account which isn't a change output
        // & tx has one or more wallet inputs & no non-wallet outputs we consider
        // the transaction as self trnsaction
        if (
          !credit.getInternal() &&
          txInputs.length > 0 &&
          tx.getCreditsList().length === outputs.length
        ) {
          selfTx = true;
        }
        // If we find credit which is not a change, then we pick
        // it as receiver
        if (!creditedAccountName || !credit.getInternal()) {
          creditedAccountName = currentCreditedAccountName;
        }
        txOutputs.push({
          accountName: currentCreditedAccountName,
          amount,
          address,
          index: credit.getIndex()
        });
        credit.getInternal()
          ? (totalChange += amount)
          : (totalFundsReceived += amount);
      });

      const txDetails =
        totalFundsReceived + totalChange + fee < totalDebit
          ? {
            txAmount: totalDebit - fee - totalChange - totalFundsReceived,
            txDirection: TRANSACTION_DIR_SENT,
            txAccountName: debitedAccountName
          }
          : totalFundsReceived + totalChange + fee === totalDebit
            ? {
              txAmount: fee,
              txDirection: TICKET_FEE,
              txAccountNameCredited: creditedAccountName,
              txAccountNameDebited: debitedAccountName
            }
            : {
              txAmount: totalFundsReceived,
              txDirection: TRANSACTION_DIR_RECEIVED,
              txAccountName: creditedAccountName
            };

      const { isMix } = isMixTx(
        wallet.decodeRawTransaction(
          Buffer.from(tx.getTransaction()),
          chainParams
        )
      );

      return {
        txUrl,
        txBlockUrl,
        txHash,
        txHeight: height,
        txType,
        timestamp,
        isPending: !timestamp,
        txFee: fee,
        txInputs,
        txOutputs,
        txBlockHash,
        txNumericType: type,
        rawTx,
        outputs,
        creditAddresses,
        mixedTx: isMix || debitedAccountName === mixedAccountName,
        selfTx: !isMix && selfTx,
        ...txDetails
      };
    };
  }
);

// ****** Transactions selectors ********

// transactions selectors before normalized
// these selectors are maps, with tx hash as key, containing all transactions
// which decrediton already known about them.
const stakeTxs = get(["grpc", "stakeTransactions"]);
const regularTxs = get(["grpc", "regularTransactions"]);

// transactions selectors normalized.
export const regularTransactions = createSelector(
  [transactionNormalizer, regularTxs],
  (normalizerFn, txsMap) => {
    return Object.keys(txsMap).reduce((normalizedMap, txHash) => {
      const tx = txsMap[txHash];
      if (tx.isStake) return null;
      normalizedMap[txHash] = normalizerFn(tx);
      return normalizedMap;
    }, {});
  }
);

export const stakeTransactions = createSelector(
  [ticketNormalizer, stakeTxs],
  (normalizerFn, txsMap) => {
    return Object.keys(txsMap).reduce((normalizedMap, txHash) => {
      const tx = txsMap[txHash];
      normalizedMap[txHash] = normalizerFn(tx);
      return normalizedMap;
    }, {});
  }
);

export const startRequestHeight = get(["grpc", "startRequestHeight"]);

export const noMoreRegularTxs = get([
  "grpc",
  "getRegularTxsAux",
  "noMoreTransactions"
]);
export const noMoreStakeTxs = get([
  "grpc",
  "getStakeTxsAux",
  "noMoreTransactions"
]);
export const transactionsFilter = get(["grpc", "transactionsFilter"]);
export const ticketsFilter = get(["grpc", "ticketsFilter"]);

export const getStakeTransactionsCancel = get([
  "grpc",
  "stakeTransactionsCancel"
]);

// filterTransactions filters a list of transactions given a filtering object.
//
// Currently supported filters in the filter object:
// - type (array): Array of types a transaction must belong to, to be accepted.
// - direction (string): A string of one of the allowed directions for regular
//   transactions (sent/received/transferred)
//
// If empty, all transactions are accepted.
export const filteredRegularTxs = createSelector(
  [regularTransactions, transactionsFilter],
  (transactions, filter) => {
    const filteredTxs = Object.keys(transactions)
      .map((hash) => transactions[hash])
      .filter((v) =>
        filter.direction ? filter.direction === v.txDirection : true
      )
      .filter((v) =>
        filter.search
          ? v.creditAddresses.find(
            (address) =>
              address.length > 1 &&
              address.toLowerCase().indexOf(filter.search.toLowerCase()) !==
              -1
          ) != undefined
          : true
      )
      .filter((v) =>
        filter.minAmount ? Math.abs(v.txAmount) >= filter.minAmount : true
      )
      .filter((v) =>
        filter.maxAmount ? Math.abs(v.txAmount) <= filter.maxAmount : true
      )
      .filter((v) => {
        let isSameType = true;
        if (filter.types.length > 0) {
          isSameType = false;
          filter.types.forEach((type) =>
            type === v.txType || (type === MIXED && v.mixedTx)
              ? (isSameType = true)
              : null
          );
        }
        return isSameType;
      });

    return filteredTxs;
  }
);

export const filteredStakeTxs = createSelector(
  [stakeTransactions, ticketsFilter],
  (transactions, filter) => {
    const filteredTxs = Object.keys(transactions)
      .map((hash) => transactions[hash])
      .filter((v) => (filter.status ? filter.status === v.status : true));

    return filteredTxs;
  }
);

export const lastVotedTicket = createSelector(
  [stakeTransactions],
  (transactions) => {
    const lastVotedTicket = Object.keys(transactions)
      .map((hash) => transactions[hash])
      .filter((transaction) => transaction.status == VOTED)
      .reduce(
        (prev, current) =>
          prev.leaveTimestamp > current.leaveTimestamp ? prev : current,
        []
      );

    return Array.isArray(lastVotedTicket) ? null : lastVotedTicket;
  }
);

// note that hasTickets means "ever had any tickets", **NOT** "currently has live
// tickets".
export const hasTickets = compose(
  (t) => t && Object.keys(t).length > 0,
  stakeTransactions
);

const transactionsNormalizer = createSelector([transactionNormalizer], map);
const ticketsNormalizer = createSelector([ticketNormalizer], map);

export const homeHistoryTickets = createSelector(
  [ticketsNormalizer, get(["grpc", "recentStakeTransactions"])],
  apply
);

export const homeHistoryTransactions = createSelector(
  [transactionsNormalizer, get(["grpc", "recentRegularTransactions"])],
  apply
);

// ******* end of transactions selectors ************

// ************** VSP selectors ******************
// purchase tickets selectors
export const getAvailableVSPs = get(["vsp", "availableVSPs"]);
export const getDiscoverAvailableVSPError = get(["vsp", "availableVSPsError"]);

// ticket auto buyer
export const getTicketAutoBuyerRunning = get(["vsp", "ticketAutoBuyerRunning"]);
export const buyerVSP = get(["vsp", "vsp"]);
export const buyerBalanceToMantain = get(["vsp", "balanceToMaintain"]);
export const buyerAccount = get(["vsp", "account"]);
export const getHasVSPTicketsError = get(["vsp", "hasVSPTicketsError"]);
export const getIsLegacy = get(["vsp", "isLegacy"]);
export const getRememberedVspHost = get(["vsp", "rememberedVspHost"]);

const getVSPTicketsHashes = get(["vsp", "vspTickets"]);

// getVSPTickets is a selector for getting an object with feeStatus as keys
// and an array of tickets which have this feeStatus.
export const getVSPTickets = createSelector(
  [getVSPTicketsHashes, stakeTransactions],
  (hashes, txsMap) => {
    if (!hashes) return;
    const vspTickets = {};
    Object.keys(hashes).forEach((feeStatus) => {
      // fee status hashes
      const fsHashes = hashes[feeStatus];

      fsHashes.forEach((hash) => {
        if (!vspTickets[feeStatus]) {
          vspTickets[feeStatus] = [];
        }
        if (!hash) return;
        // right now we only show fee status for tickets which can be voted.
        if (!txsMap[hash]) {
          // it should not have an uknown tx. If there is, we should get this tx
          // before showing the vsp tickets.
          return null;
        }
        if (
          txsMap[hash].status === IMMATURE ||
          txsMap[hash].status === LIVE ||
          txsMap[hash].status === UNMINED
        ) {
          const objCopy = Object.assign({}, txsMap[hash]);
          objCopy.feeStatus = feeStatus;
          vspTickets[feeStatus] = [objCopy, ...vspTickets[feeStatus]];
        }
        return null;
      });
    });
    return vspTickets;
  }
);

// ****************** end of vsp selectors ******************

export const dailyBalancesStats = get(["statistics", "dailyBalances"]);

export const spendableAndLockedBalance = createSelector(
  [dailyBalancesStats, unitDivisor],
  (stats, unitDivisor) =>
    stats.map((s) => ({
      time: s.time,
      available: s.series.spendable / unitDivisor,
      locked:
        (s.series.locked + s.series.immature + s.series.immatureNonWallet) /
        unitDivisor
    }))
);

export const balanceSent = createSelector([dailyBalancesStats], (balances) =>
  balances.reduce((s, b) => s + b.series.sent, 0)
);

export const balanceReceived = createSelector(
  [dailyBalancesStats],
  (balances) => balances.reduce((s, b) => s + b.series.received, 0)
);

export const sentAndReceivedTransactions = createSelector(
  [dailyBalancesStats, unitDivisor],
  (stats, unitDivisor) =>
    stats.map((s) => ({
      time: s.time,
      sent: s.series.sent / unitDivisor,
      received: s.series.received / unitDivisor
    }))
);

//fake data for ticket tab on overview Page
export const totalValueOfLiveTickets = createSelector(
  [dailyBalancesStats],
  (balances) => {
    if (!balances) return 0;
    const lastBalance = balances[balances.length - 1];
    if (!lastBalance) return 0;
    return lastBalance.series.locked;
  }
);

export const ticketDataHeatmap = get(["statistics", "ticketDataHeatmap"]);

export const ticketDataChart = createSelector(
  [dailyBalancesStats, unitDivisor],
  (stats, unitDivisor) =>
    stats.map((s) => ({
      time: s.time,
      voted: s.series.voted / unitDivisor,
      revoked: s.series.revoked / unitDivisor,
      ticket: s.series.ticket / unitDivisor,
      locked: (s.series.locked + s.series.immature) / unitDivisor,
      immature: s.series.immature / unitDivisor
    }))
);

const rescanResponse = get(["control", "rescanResponse"]);
export const rescanRequest = get(["control", "rescanRequest"]);
export const getTransactionsRequestAttempt = get([
  "grpc",
  "getTransactionsRequestAttempt"
]);
export const notifiedBlockHeight = get(["notifications", "currentHeight"]);

export const currentBlockHeight = get(["grpc", "currentBlockHeight"]);
export const getNoMoreLiveTickets = get(["grpc", "noMoreLiveTickets"]);

export const rescanEndBlock = currentBlockHeight;
export const rescanStartBlock = compose(
  (req) => (req ? req.getBeginHeight() : 0),
  rescanRequest
);
export const rescanCurrentBlock = compose(
  (res) => (res ? res.getRescannedThrough() : 0),
  rescanResponse
);

export const rescanPercentFinished = createSelector(
  [rescanCurrentBlock, rescanEndBlock],
  (current, end) => ((current / end) * 100).toFixed(2)
);

export const visibleAccounts = createSelector(
  [unitDivisor, currencyDisplay, balances],
  (unitDivisor, currencyDisplay, balances) =>
    reduce(
      (accounts, { accountName, accountNumber, hidden, spendable, ...data }) =>
        accountName === "imported" || hidden
          ? accounts
          : [
            ...accounts,
            {
              value: accountNumber,
              label: `${accountName}: ${spendable / unitDivisor
                } ${currencyDisplay}`,
              name: accountName,
              spendableAndUnit: `${spendable / unitDivisor
                } ${currencyDisplay}`,
              spendable,
              hidden,
              ...data
            }
          ],
      [],
      balances
    )
);

export const spendingAccounts = createSelector(
  [unitDivisor, currencyDisplay, balances],
  (unitDivisor, currencyDisplay, balances) =>
    reduce(
      (accounts, { accountName, accountNumber, spendable, ...data }) =>
        accountNumber !== 0 && (accountName === "imported" || spendable <= 0)
          ? accounts
          : [
            ...accounts,
            {
              value: accountNumber,
              label: `${accountName}: ${spendable / unitDivisor
                } ${currencyDisplay}`,
              name: accountName,
              spendableAndUnit: `${spendable / unitDivisor
                } ${currencyDisplay}`,
              spendable,
              ...data
            }
          ],
      [],
      balances
    )
);

const getNextAddressResponse = get(["control", "getNextAddressResponse"]);
const nextAddressAccountNumber = compose(
  (res) => (res ? res.accountNumber : null),
  getNextAddressResponse
);

export const getNextAddressRequestAttempt = get([
  "control",
  "getNextAddressRequestAttempt"
]);
export const nextAddressAccount = createSelector(
  [visibleAccounts, nextAddressAccountNumber],
  (accounts, number) => accounts.find(compose(eq(number), get("value")))
);
export const nextAddress = compose(get("address"), getNextAddressResponse);

export const defaultSpendingAccount = createSelector(
  [visibleAccounts, getMixedAccount],
  (accounts, mixedAccount) =>
    accounts.find(compose(eq(mixedAccount || 0), get("value")))
);

export const defaultSpendingAccountDisregardMixedAccount = createSelector(
  [visibleAccounts],
  (accounts) => accounts.find(compose(eq(0), get("value")))
);

export const changePassphraseRequestAttempt = get([
  "control",
  "changePassphraseRequestAttempt"
]);

export const constructTxLowBalance = get(["control", "constructTxLowBalance"]);
export const constructTxResponse = get(["control", "constructTxResponse"]);
const constructTxRequestAttempt = get(["control", "constructTxRequestAttempt"]);
const signTransactionRequestAttempt = get([
  "control",
  "signTransactionRequestAttempt"
]);
export const signTransactionError = get(["control", "signTransactionError"]);
const publishTransactionRequestAttempt = get([
  "control",
  "publishTransactionRequestAttempt"
]);
const totalOutputAmount = compose(
  (r) => (r ? r.getTotalOutputAmount() : 0),
  constructTxResponse
);
const totalAmount = compose(
  (res) => (res ? res.totalAmount : 0),
  constructTxResponse
);
const totalPreviousOutputAmount = compose(
  (res) => (res ? res.getTotalPreviousOutputAmount() : 0),
  constructTxResponse
);

export const publishTxResponse = get(["control", "publishTransactionResponse"]);

export const estimatedSignedSize = compose(
  (res) => (res ? res.getEstimatedSignedSize() : 0),
  constructTxResponse
);

export const unsignedTransaction = createSelector(
  [constructTxResponse],
  (res) => (res ? res.getUnsignedTransaction() : null)
);

export const unsignedRawTx = createSelector(
  [constructTxResponse],
  (res) => res && res.rawTx
);

export const estimatedFee = compose(
  (bytes) => (bytes / 1000) * (MIN_RELAY_FEE * UNIT_DIVISOR),
  estimatedSignedSize
);

export const getPeersCount = get(["grpc", "peersCount"]);

export const totalSpent = createSelector(
  [totalPreviousOutputAmount, totalOutputAmount, totalAmount],
  (totalPreviousOutputAmount, totalOutputAmount, totalAmount) =>
    totalPreviousOutputAmount - totalOutputAmount + totalAmount
);

export const isSendingTransaction = bool(
  or(signTransactionRequestAttempt, publishTransactionRequestAttempt)
);

export const isConstructingTransaction = bool(constructTxRequestAttempt);

export const tempSettings = get(["settings", "tempSettings"]);
export const settingsChanged = get(["settings", "settingsChanged"]);
export const uiAnimations = get(["settings", "currentSettings", "uiAnimations"]);
export const changePassphraseError = get(["control", "changePassphraseError"]);
export const changePassphraseSuccess = get([
  "control",
  "changePassphraseSuccess"
]);
export const updatedStakePoolList = get(["stakepool", "updatedStakePoolList"]);
export const allowedExternalRequests = get([
  "settings",
  "currentSettings",
  "allowedExternalRequests"
]);
export const stakePoolListingEnabled = compose(
  (l) => l.indexOf(EXTERNALREQUEST_STAKEPOOL_LISTING) > -1,
  allowedExternalRequests
);
export const dismissBackupRedeemScript = get([
  "stakepool",
  "dismissBackupRedeemScript"
]);

export const isSigningMessage = get(["grpc", "getSignMessageRequestAttempt"]);
export const signMessageError = get(["grpc", "getSignMessageError"]);
export const signMessageSignature = get(["grpc", "getSignMessageSignature"]);

export const messageVerificationService = get([
  "grpc",
  "messageVerificationService"
]);
export const isVerifyingMessage = get([
  "grpc",
  "getVerifyMessageRequestAttempt"
]);
export const verifyMessageError = get(["grpc", "getVerifyMessageError"]);
export const verifyMessageResponse = get(["grpc", "getVerifyMessageResponse"]);
export const verifyMessageSuccess = compose(
  (r) => (r ? r.toObject() : null),
  verifyMessageResponse
);

const getStakeInfoResponse = get(["grpc", "getStakeInfoResponse"]);

export const ticketPoolSize = compose(
  (r) => (r ? r.getPoolSize() : 0),
  getStakeInfoResponse
);
export const votedTicketsCount = compose(
  (r) => (r ? r.getVoted() : 0),
  getStakeInfoResponse
);
export const allMempoolTicketsCount = compose(
  (r) => (r ? r.getAllMempoolTix() : 0),
  getStakeInfoResponse
);
export const missedTicketsCount = compose(
  (r) => (r ? r.getMissed() : 0),
  getStakeInfoResponse
);
export const ownMempoolTicketsCount = compose(
  (r) => (r ? r.getOwnMempoolTix() : 0),
  getStakeInfoResponse
);
export const revokedTicketsCount = compose(
  (r) => (r ? r.getRevoked() : 0),
  getStakeInfoResponse
);
export const immatureTicketsCount = compose(
  (r) => (r ? r.getImmature() : 0),
  getStakeInfoResponse
);
export const expiredTicketsCount = compose(
  (r) => (r ? r.getExpired() : 0),
  getStakeInfoResponse
);
export const liveTicketsCount = compose(
  (r) => (r ? r.getLive() : 0),
  getStakeInfoResponse
);
export const unspentTicketsCount = compose(
  (r) => (r ? r.getUnspent() : 0),
  getStakeInfoResponse
);
export const activeTicketsCount = createSelector(
  [isSPV, getStakeInfoResponse],
  (isSPV, r) =>
    isSPV ? r.getUnspent() + r.getImmature() : r.getLive() + r.getImmature()
);
export const totalSubsidy = compose(
  (r) => (r ? r.getTotalSubsidy() : 0),
  getStakeInfoResponse
);

export const ticketBuyerService = get(["grpc", "ticketBuyerService"]);
export const ticketBuyerConfig = get(["control", "ticketBuyerConfig"]);

export const balanceToMaintain = get(["control", "balanceToMaintain"]);

const getTicketPriceResponse = get(["grpc", "getTicketPriceResponse"]);

export const ticketPrice = compose(
  (r) => (r ? r.getTicketPrice() : 0),
  getTicketPriceResponse
);

const requiredStakepoolAPIVersion = get([
  "grpc",
  "requiredStakepoolAPIVersion"
]);

export const currentStakePoolConfigError = get([
  "stakepool",
  "currentStakePoolConfigError"
]);

export const purchaseTicketsError = get(["control", "purchaseTicketsError"]);
export const purchaseTicketsSuccess = get([
  "control",
  "purchaseTicketsSuccess"
]);
export const revokeTicketsError = get(["control", "revokeTicketsError"]);
export const revokeTicketsSuccess = get(["control", "revokeTicketsSuccess"]);
export const importScriptSuccess = get(["control", "importScriptSuccess"]);
export const importScriptError = get(["control", "importScriptError"]);
export const startAutoBuyerError = get(["control", "startAutoBuyerError"]);
export const startAutoBuyerSuccess = get(["control", "startAutoBuyerSuccess"]);
export const stopAutoBuyerError = get(["control", "stopAutoBuyerError"]);
export const stopAutoBuyerSuccess = get(["control", "stopAutoBuyerSuccess"]);

const purchaseTicketsResponse = get(["control", "purchaseTicketsResponse"]);

export const splitTx = createSelector(
  [purchaseTicketsResponse],
  (res) => res && Buffer.from(res.getSplitTx()).toString("hex")
);

export const ticketsList = createSelector(
  [purchaseTicketsResponse],
  (res) =>
    res && res.getTicketsList().map((t) => Buffer.from(t).toString("hex"))
);

export const currentStakePoolConfig = get([
  "stakepool",
  "currentStakePoolConfig"
]);

const allStakePoolStats = get(["stakepool", "getStakePoolInfo"]);

const allStakePoolStatsList = createSelector(
  [allStakePoolStats, requiredStakepoolAPIVersion],
  (pools, requiredVersion) =>
    map(
      (pool) => ({
        ...pool,
        label: pool.URL,
        value: pool,
        isVersionValid: pool.APIVersionsSupported[1] === requiredVersion
      }),
      pools
    )
);
export const networkStakePoolStatsList = createSelector(
  [allStakePoolStatsList, network],
  (pools, network) => filter(compose(eq(network), get("Network")), pools)
);

const allStakePools = createSelector(
  [currentStakePoolConfig, requiredStakepoolAPIVersion],
  (pools, requiredVersion) =>
    map(
      (pool) => ({
        ...pool,
        label: pool.Host,
        value: pool,
        isVersionValid: pool.APIVersionsSupported[1] === requiredVersion
      }),
      pools
    )
);

const networkStakePools = createSelector(
  [allStakePools, network],
  (pools, network) => filter(compose(eq(network), get("Network")), pools)
);

export const configuredStakePools = createSelector(
  [networkStakePools],
  filter(bool(get("ApiKey")))
);

export const unconfiguredStakePools = createSelector(
  [networkStakePools],
  filter(not(get("ApiKey")))
);

export const defaultStakePool = compose(get(0), configuredStakePools);
export const selectedStakePool = get(["stakepool", "selectedStakePool"]);

const currentStakePoolConfigRequest = get([
  "stakepool",
  "currentStakePoolConfigRequest"
]);

export const purchaseTicketsRequestAttempt = get([
  "control",
  "purchaseTicketsRequestAttempt"
]);

const importScriptRequestAttempt = get([
  "control",
  "importScriptRequestAttempt"
]);

// LEGACY selectors.
// Keep them while we still support old version of vsps.
export const isSavingStakePoolConfig = bool(currentStakePoolConfigRequest);
export const isAddingCustomStakePool = bool(
  get(["stakePool", "addCustomStakePoolAttempt"])
);
export const isPurchasingTickets = bool(purchaseTicketsRequestAttempt);
export const isImportingScript = bool(importScriptRequestAttempt);

// end of LEGACY selectors

export const newUnminedMessage = get(["notifications", "newUnminedMessage"]);

export const lastBlockTimestamp = get(["grpc", "recentBlockTimestamp"]);

export const getNextAccountSuccess = get(["control", "getNextAccountSuccess"]);
export const getNextAccountError = get(["control", "getNextAccountError"]);
export const getNextAccountRequestAttempt = get([
  "control",
  "getNextAccountRequestAttempt"
]);
export const hiddenAccounts = get(["daemon", "hiddenAccounts"]);
export const renameAccountError = get(["control", "renameAccountError"]);
export const renameAccountSuccess = get(["control", "renameAccountSuccess"]);
export const renameAccountRequestAttempt = get([
  "control",
  "renameAccountRequestAttempt"
]);

export const location = get(["router", "location"]);
export const isGetStarted = compose(
  (l) => /^\/getstarted\//.test(l.pathname),
  location
);

export const showingSidebarMenu = not(isGetStarted);
export const expandSideBar = get(["sidebar", "expandSideBar"]);
export const sidebarOnBottom = get(["sidebar", "sidebarOnBottom"]);

export const snackbarMessages = get(["snackbar", "messages"]);

export const mainWindow = () => window;

export const shutdownRequested = get(["daemon", "shutdownRequested"]);
export const daemonStopped = get(["daemon", "daemonStopped"]);

export const blocksPassedOnTicketInterval = createSelector(
  [chainParams, currentBlockHeight],
  (chainParams, currentBlockHeight) => {
    if (!chainParams || !currentBlockHeight) return 0;
    const { WorkDiffWindowSize } = chainParams;
    return currentBlockHeight % WorkDiffWindowSize;
  }
);

export const blocksNumberToNextTicket = createSelector(
  [chainParams, blocksPassedOnTicketInterval],
  (chainParams, blocksPassedOnTicketInterval) => {
    const { WorkDiffWindowSize } = chainParams;
    return WorkDiffWindowSize - blocksPassedOnTicketInterval;
  }
);

// blockTimestampFromNow is a selector that returns a function that can be used
// to estimate when a given future block will be received. This is isn't super
// accurate, and depends on the fact that blocks will take on average the
// TargetTimePerBlock of their chain, but is sufficient for most display
// purposes.
export const blockTimestampFromNow = createSelector(
  [chainParams, currentBlockHeight],
  (chainParams, currentHeight) => {
    const currentTimestamp = new Date().getTime() / 1000;
    return (block) => {
      return Math.trunc(
        currentTimestamp +
        (block - currentHeight) * chainParams.TargetTimePerBlock
      );
    };
  }
);
export const exportingData = get(["control", "exportingData"]);

export const voteTimeStats = get(["statistics", "voteTime"]);
export const averageVoteTime = createSelector(
  [voteTimeStats],
  (voteTimeStats) => {
    if (!voteTimeStats || !voteTimeStats.data.length) return 0;
    const ticketCount = voteTimeStats.data.reduce(
      (s, v) => s + v.series.count,
      0
    );
    if (ticketCount === 0) return 0;
    let sum = 0;
    for (let i = 0; i < voteTimeStats.data.length; i++) {
      sum += voteTimeStats.data[i].series.count * i;
    }
    return sum / ticketCount;
  }
);
export const medianVoteTime = createSelector(
  [voteTimeStats],
  (voteTimeStats) => {
    if (!voteTimeStats || !voteTimeStats.data.length) return 0;
    const ticketCount = voteTimeStats.data.reduce(
      (s, v) => s + v.series.count,
      0
    );
    if (ticketCount === 0) return 0;
    const ticketLimit = ticketCount * 0.5;
    let sum = 0;
    for (let i = 0; i < voteTimeStats.data.length; i++) {
      sum += voteTimeStats.data[i].series.count;
      if (sum >= ticketLimit) return i;
    }
  }
);
export const ninetyFifthPercentileVoteTime = createSelector(
  [voteTimeStats],
  (voteTimeStats) => {
    if (!voteTimeStats || !voteTimeStats.data.length) return 0;
    const ticketCount = voteTimeStats.data.reduce(
      (s, v) => s + v.series.count,
      0
    );
    if (ticketCount === 0) return 0;
    const ticketLimit = ticketCount * 0.95;
    let sum = 0;
    for (let i = 0; i < voteTimeStats.data.length; i++) {
      sum += voteTimeStats.data[i].series.count;
      if (sum >= ticketLimit) return i;
    }
  }
);
export const getMyTicketsStatsRequest = get([
  "statistics",
  "getMyTicketsStatsRequest"
]);

export const fullDailyBalancesStats = get(["statistics", "fullDailyBalances"]);

export const stakeRewardsStats = createSelector(
  [fullDailyBalancesStats, unitDivisor],
  (stats, unitDivisor) =>
    stats.slice(-15).map((s) => ({
      time: s.time,
      stakeRewards: s.series.stakeRewards / unitDivisor,
      stakeFees: s.series.stakeFees / unitDivisor,
      totalStake: s.series.totalStake / unitDivisor,
      stakeRewardPerc: s.series.stakeRewards / (s.series.totalStake || 1),
      stakeFeesPerc: s.series.stakeFees / (s.series.totalStake || 1)
    }))
);

export const modalVisible = get(["control", "modalVisible"]);
export const aboutModalMacOSVisible = get([
  "control",
  "aboutModalMacOSVisible"
]);
export const cantCloseModalVisible = get(["control", "cantCloseModalVisible"]);

export const isTrezor = get(["trezor", "enabled"]);
export const isPerformingTrezorUpdate = get(["trezor", "performingUpdate"]);

export const isSignMessageDisabled = and(isWatchingOnly, not(isTrezor));
export const isChangePassPhraseDisabled = isWatchingOnly;
export const isTransactionsSendTabDisabled = not(isTrezor);

export const politeiaURL = createSelector([isTestNet], (isTestNet) =>
  isTestNet ? POLITEIA_URL_TESTNET : POLITEIA_URL_MAINNET
);

export const dcrdataURL = createSelector([isTestNet], (isTestNet) =>
  isTestNet ? DCRDATA_URL_TESTNET : DCRDATA_URL_MAINNET
);

export const politeiaEnabled = compose(
  (l) => l.indexOf(EXTERNALREQUEST_POLITEIA) > -1,
  allowedExternalRequests
);

export const dcrdataEnabled = compose(
  (l) => l.indexOf(EXTERNALREQUEST_DCRDATA) > -1,
  allowedExternalRequests
);

const getAgendasResponse = get(["grpc", "getAgendasResponse"]);

const currentAgenda = createSelector([getAgendasResponse], (response) =>
  response ? response.getAgendasList()[0] : EMPTY_ARRAY
);

const allAgendasNotNormalized = get(["grpc", "allAgendas"]);

// allAgendasVerify verifies if dcrdata is enabled. If it is not we only return
// the current agenda which we got from dcrwallet.
const allAgendasVerify = createSelector(
  [currentAgenda, dcrdataEnabled, allAgendasNotNormalized],
  // If allAgendas length is 0 we return the agenda from dcrwallet, as dcrdata
  // may be down.
  (currentAgenda, dcrdataEnabled, allAgendas) =>
    !dcrdataEnabled || allAgendas.length === 0 ? [currentAgenda] : allAgendas
);

const normalizeAgenda = createSelector([currentAgenda], (currentAgenda) => {
  return (agenda) => {
    // When agenda has getId function (this happens when dcrdata privacy is disabled
    // or a possible dcrdata crash) or the agenda is the same for dcrwallet and dcrdata.
    // We use the information from our dcrwallet grpc request.
    if (
      typeof agenda.getId === "function" ||
      currentAgenda.getId() === agenda.name
    ) {
      currentAgenda.isCurrent = true;
      const agendaObj = {};
      agendaObj.name = currentAgenda.getId();
      agendaObj.choices = currentAgenda.getChoicesList();
      agendaObj.description = currentAgenda.getDescription();
      agendaObj.isCurrent = true;
      agendaObj.finished = agenda.status === "finished";
      agendaObj.passed = !!agenda.activated;
      return agendaObj;
    }
    agenda.isCurrent = false;
    agenda.finished = agenda.status === "finished";
    agenda.passed = !!agenda.activated;
    // right now we left it empty as there is no easy way to get past vote choices.
    agenda.choices = [];

    return agenda;
  };
});

export const allAgendas = createSelector(
  [allAgendasVerify, normalizeAgenda],
  (agendas, cb) => agendas.map(cb)
);

export const treasuryBalance = get(["grpc", "treasuryBalance"]);

export const proposals = get(["governance", "proposals"]);
export const proposallistpagesize = get(["governance", "proposallistpagesize"]);
export const getProposalsAttempt = get(["governance", "getProposalsAttempt"]);
export const preVoteProposals = createSelector(
  [proposals],
  (proposals) => proposals && proposals.preVote
);
export const activeVoteProposals = createSelector(
  [proposals],
  (proposals) => proposals && proposals.activeVote
);
export const finishedProposals = createSelector(
  [proposals],
  (proposals) => proposals && proposals.finishedVote
);
export const abandonedProposals = createSelector(
  [proposals],
  (proposals) => proposals && proposals.abandonedVote
);
export const inventory = get(["governance", "inventory"]);
export const newActiveVoteProposalsCount = compose(
  reduce((acc, p) => (p.votingSinceLastAccess ? acc + 1 : acc), 0),
  activeVoteProposals
);
export const newPreVoteProposalsCount = compose(
  reduce((acc, p) => (p && p.modifiedSinceLastAccess ? acc + 1 : acc), 0),
  preVoteProposals
);
export const newProposalsStartedVoting = compose(
  some((p) => p.votingSinceLastAccess),
  activeVoteProposals
);

export const getProposalError = get(["governance", "getProposalError"]);
export const getTokenInventoryError = get([
  "governance",
  "getTokenInventoryError"
]);
export const proposalsDetails = get(["governance", "proposalsDetails"]);
export const lastPoliteiaAccessBlock = get([
  "governance",
  "lastPoliteiaAccessBlock"
]);
export const lastPoliteiaAccessTime = get([
  "governance",
  "lastPoliteiaAccessTime"
]);

export const trezorWaitingForPin = get(["trezor", "waitingForPin"]);
export const trezorWaitingForPassPhrase = get([
  "trezor",
  "waitingForPassPhrase"
]);
export const trezorWaitingForWord = get(["trezor", "waitingForWord"]);
export const trezorPerformingOperation = get(["trezor", "performingOperation"]);
export const trezorDevice = get(["trezor", "device"]);
export const trezorLabel = get(["trezor", "deviceLabel"]);
export const trezorWalletCreationMasterPubkeyAttempt = get([
  "trezor",
  "walletCreationMasterPubkeyAttempt"
]);

// selectors for checking if decrediton can be closed.

// TODO remove duplicated auto buyer running selector
const startAutoBuyerResponse = get(["control", "startAutoBuyerResponse"]);
export const isTicketAutoBuyerEnabled = bool(startAutoBuyerResponse);

// getRunningIndicator is a indicator for indicate something is runnning on
// decrediton, like the ticket auto buyer or the mixer.
export const getRunningIndicator = or(
  getAccountMixerRunning,
  getTicketAutoBuyerRunning,
  purchaseTicketsRequestAttempt,
  isTicketAutoBuyerEnabled
);

export const getHasTicketFeeError = createSelector([getVSPTickets], (vspTickets) => {
  if (!vspTickets) return;
  return vspTickets[VSP_FEE_PROCESS_ERRORED]
    ? vspTickets[VSP_FEE_PROCESS_ERRORED].length > 0
    : false;
});
export const getCanClose = not(or(getRunningIndicator, getHasTicketFeeError));

// end of selectors for closing decrediton.

// ln selectors

export const lnEnabled = bool(and(not(isWatchingOnly), not(isTrezor)));
export const lnActive = bool(get(["ln", "active"]));
export const lnStartupStage = get(["ln", "startupStage"]);
export const lnStartAttempt = bool(get(["ln", "startAttempt"]));
export const lnWalletExists = bool(get(["ln", "exists"]));
export const lnInfo = get(["ln", "info"]);
export const lnNetwork = get(["ln", "network"]);
export const lnGetNodeInfoAttempt = bool(get(["ln", "getNodeInfoAttempt"]));
export const lnNodeInfo = get(["ln", "nodeInfo"]);
export const lnGetRoutesInfoAttempt = bool(get(["ln", "getRoutesInfoAttempt"]));
export const lnRoutesInfo = get(["ln", "routes"]);
export const lnWalletBalances = get(["ln", "walletBalances"]);
export const lnChannelBalances = get(["ln", "channelBalances"]);
export const lnChannels = get(["ln", "channels"]);
export const lnPendingChannels = get(["ln", "pendingChannels"]);
export const lnClosedChannels = get(["ln", "closedChannels"]);
export const lnInvoices = get(["ln", "invoices"]);
export const lnPayments = get(["ln", "payments"]);
export const lnOutstandingPayments = get(["ln", "outstandingPayments"]);
export const lnFailedPayments = get(["ln", "failedPayments"]);
export const lnAddInvoiceAttempt = get(["ln", "addInvoiceAttempt"]);
export const lnSCBPath = get(["ln", "scbPath"]);
export const lnSCBUpdatedTime = get(["ln", "scbUpdatedTime"]);
export const lnTowersList = get(["ln", "towersList"]);

// end of ln selectors
