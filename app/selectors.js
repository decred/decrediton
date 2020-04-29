import {
  compose,
  reduce,
  filter,
  get,
  not,
  or,
  and,
  eq,
  find,
  bool,
  map,
  apply,
  some,
  createSelectorEager as createSelector
} from "./fp";
import { appLocaleFromElectronLocale } from "./i18n/locales";
import { reverseHash } from "./helpers/byteActions";
import { TRANSACTION_TYPES } from "wallet/service";
import { MainNetParams, TestNetParams } from "constants";
import { /*TicketTypes,*/ decodeVoteScript } from "./helpers/tickets";
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
import { dateToLocal, dateToUTC } from "./helpers/dateFormat";
import {
  MIN_RELAY_FEE,
  DCR,
  ATOMS,
  UNIT_DIVISOR,
  TESTNET,
  MAINNET
} from "constants";
import * as wallet from "wallet";

const EMPTY_ARRAY = []; // Maintaining identity (will) improve performance;

export const theme = get(["settings", "theme"]);
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
export const maxWalletCount = get(["walletLoader", "maxWalletCount"]);

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
export const getMixedAccount = get(["walletLoader", "mixedAccount"]);
export const getChangeAccount = get(["walletLoader", "changeAccount"]);
export const getCsppServer = get(["walletLoader", "csppServer"]);
export const getCsppPort = get(["walletLoader", "csppPort"]);
export const getMixedAccountBranch = get([
  "walletLoader",
  "mixedAccountBranch"
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
export const walletService = get(["grpc", "walletService"]);
export const agendaService = get(["grpc", "agendaService"]);
export const votingService = get(["grpc", "votingService"]);
export const accountMixerService = get(["grpc", "accountMixerService"]);
export const getBalanceRequestAttempt = get([
  "grpc",
  "getBalanceRequestAttempt"
]);
export const getAccountsResponse = get(["grpc", "getAccountsResponse"]);
export const getNetworkResponse = get(["grpc", "getNetworkResponse"]);
export const getNetworkError = get(["grpc", "getNetworkError"]);
export const getAccountMixerRunning = get(["grpc", "accountMixerRunning"]);
const accounts = createSelector([getAccountsResponse], (r) =>
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

const getTxTypeStr = (type) => TRANSACTION_TYPES[type];

export const txURLBuilder = createSelector([network], (network) => (txHash) =>
  `https://${
    network !== TESTNET ? "dcrdata" : "testnet"
  }.decred.org/tx/${txHash}`
);

export const blockURLBuilder = createSelector(
  [network],
  (network) => (txHash) =>
    `https://${
      network !== TESTNET ? "dcrdata" : "testnet"
    }.decred.org/block/${txHash}`
);

export const txOutURLBuilder = createSelector(
  [network],
  (network) => (txHash, outputIdx) =>
    `https://${
      network !== "testnet" ? "explorer" : network
    }.dcrdata.org/tx/${txHash}/out/${outputIdx}`
);

export const decodedTransactions = get(["grpc", "decodedTransactions"]);

export const ticketNormalizer = createSelector(
  [network, accounts],
  (network, accounts) => {
    return (ticket) => {
      const findAccount = (num) =>
        accounts.find((account) => account.getAccountNumber() === num);
      const getAccountName = (num) =>
        ((act) => (act ? act.getAccountName() : ""))(findAccount(num));
      const hasSpender = ticket.spender && ticket.spender.getHash();
      const isVote = ticket.status === "voted";
      const isPending = ticket.status === "unmined";
      const ticketTx = ticket.ticket;
      const spenderTx = hasSpender ? ticket.spender : null;
      const txHash = reverseHash(
        Buffer.from(ticketTx.getHash()).toString("hex")
      );
      const spenderHash = hasSpender
        ? reverseHash(Buffer.from(spenderTx.getHash()).toString("hex"))
        : null;
      const hasCredits = ticketTx.getCreditsList().length > 0;

      let ticketPrice = 0;
      if (hasCredits) {
        ticketPrice = ticketTx.getCreditsList()[0].getAmount();
      } else {
        // we don't have a credit when we don't have the voting rights (unimported
        // stakepool script, solo voting ticket, split ticket, etc)
        const decodedTicketTx = wallet.decodeRawTransaction(
          Buffer.from(ticketTx.getTransaction())
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
      const debitList = ticketTx.getDebitsList();
      const accountName = getAccountName(debitList[0].getPreviousAccount());
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
          Buffer.from(spenderTx.getTransaction())
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
        spenderHash,
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
        ticketRawTx: Buffer.from(ticketTx.getTransaction()).toString("hex"),
        spenderRawTx: hasSpender
          ? Buffer.from(spenderTx.getTransaction()).toString("hex")
          : null,
        originalTicket: ticket,
        isPending,
        accountName
      };
    };
  }
);

export const noMoreTickets = get(["grpc", "noMoreTickets"]);
export const ticketsFilter = get(["grpc", "ticketsFilter"]);
export const getTicketsProgressStartRequestHeight = get([
  "grpc",
  "getTicketsProgressStartRequestHeight"
]);
export const ticketsNormalizer = createSelector([ticketNormalizer], map);
export const tickets = get(["grpc", "tickets"]);
export const numTicketsToBuy = get(["control", "numTicketsToBuy"]);

// note that hasTickets means "ever had any tickets", **NOT** "currently has live
// tickets".
export const hasTickets = compose((t) => t && t.length > 0, tickets);

// aux map from ticket/spender hash => ticket info
const txHashToTicket = createSelector(
  [tickets],
  reduce((m, t) => {
    m[t.txHash] = t;
    m[t.spenderHash] = t;
    return m;
  }, {})
);

export const transactionNormalizer = createSelector(
  [accounts, txURLBuilder, blockURLBuilder],
  (accounts, txURLBuilder, blockURLBuilder) => {
    const findAccount = (num) =>
      accounts.find((account) => account.getAccountNumber() === num);
    const getAccountName = (num) =>
      ((act) => (act ? act.getAccountName() : ""))(findAccount(num));
    return (origTx) => {
      const { blockHash } = origTx;
      const type =
        origTx.type ||
        (origTx.getTransactionType ? origTx.getTransactionType() : null);
      const txInfo = origTx.tx ? origTx : {};
      let timestamp = origTx.timestamp;
      const tx = origTx.tx || origTx;
      timestamp = timestamp || tx.timestamp;
      let totalFundsReceived = 0;
      let totalChange = 0;
      const addressStr = [];
      let debitedAccount;
      let creditedAccount;
      const txInputs = [];
      const txOutputs = [];
      const txHash = reverseHash(Buffer.from(tx.getHash()).toString("hex"));
      const txBlockHash = blockHash
        ? reverseHash(Buffer.from(blockHash).toString("hex"))
        : null;
      const fee = tx.getFee();
      let debitedAccountName, creditedAccountName;
      const totalDebit = tx.getDebitsList().reduce((total, debit) => {
        debitedAccount = debit.getPreviousAccount();
        debitedAccountName = getAccountName(debitedAccount);
        const amount = debit.getPreviousAmount();
        txInputs.push({
          accountName: debitedAccountName,
          amount,
          index: debit.getIndex()
        });
        return total + amount;
      }, 0);

      tx.getCreditsList().forEach((credit) => {
        const amount = credit.getAmount();
        const address = credit.getAddress();
        addressStr.push(address);
        creditedAccount = credit.getAccount();
        creditedAccountName = getAccountName(creditedAccount);
        txOutputs.push({
          accountName: creditedAccountName,
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
              txDescription: { direction: "Sent", addressStr: addressStr },
              txAmount: totalDebit - fee - totalChange - totalFundsReceived,
              txDirection: "out",
              txAccountName: getAccountName(debitedAccount)
            }
          : totalFundsReceived + totalChange + fee === totalDebit
          ? {
              txDescription: { direction: "Transferred", addressStr },
              txAmount: fee,
              txDirection: "transfer",
              txAccountNameCredited: getAccountName(creditedAccount),
              txAccountNameDebited: getAccountName(debitedAccount)
            }
          : {
              txDescription: { direction: "Received at:", addressStr },
              txAmount: totalFundsReceived,
              txDirection: "in",
              txAccountName: getAccountName(creditedAccount)
            };

      const stakeInfo = {};
      if (origTx.ticketPrice) stakeInfo.ticketPrice = origTx.ticketPrice;
      if (origTx.enterTimestamp)
        stakeInfo.enterTimestamp = origTx.enterTimestamp;
      if (origTx.leaveTimestamp)
        stakeInfo.leaveTimestamp = origTx.leaveTimestamp;
      if (origTx.ticketReward) stakeInfo.ticketReward = origTx.ticketReward;

      return {
        txUrl: txURLBuilder(txHash),
        txBlockUrl: txBlockHash ? blockURLBuilder(txBlockHash) : null,
        txHash,
        txHeight: txInfo.height,
        txType: getTxTypeStr(type),
        txTimestamp: timestamp,
        isPending: !timestamp,
        txFee: fee,
        txInputs,
        txOutputs,
        txBlockHash,
        txNumericType: type,
        rawTx: Buffer.from(tx.getTransaction()).toString("hex"),
        originalTx: origTx,
        ...txDetails,
        ...stakeInfo
      };
    };
  }
);

export const noMoreTransactions = get(["grpc", "noMoreTransactions"]);
const transactionsNormalizer = createSelector([transactionNormalizer], map);
export const transactionsFilter = get(["grpc", "transactionsFilter"]);
export const hasUnminedTransactions = compose(
  (l) => l && l.length > 0,
  get(["grpc", "unminedTransactions"])
);
export const transactions = createSelector(
  [transactionsNormalizer, get(["grpc", "transactions"])],
  apply
);

export const homeHistoryTransactions = createSelector(
  [transactionsNormalizer, get(["grpc", "recentRegularTransactions"])],
  apply
);

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

export const viewedDecodedTransaction = createSelector(
  [
    transactions,
    (
      state,
      {
        match: {
          params: { txHash }
        }
      }
    ) => txHash,
    decodedTransactions
  ],
  (transactions, txHash, decodedTransactions) => decodedTransactions[txHash]
);

const recentStakeTransactions = createSelector(
  [transactionsNormalizer, get(["grpc", "recentStakeTransactions"])],
  apply
);

export const homeHistoryTickets = createSelector(
  [recentStakeTransactions, txHashToTicket],
  (recentStakeTransactions, txHashToTicket) => {
    return recentStakeTransactions
      .map((tx) => {
        const ticketDecoded = txHashToTicket[tx.txHash];
        if (!ticketDecoded) {
          // ordinarily, this shouldn't happen as we should have all tickets purchases
          // and spends (votes/revocations) stored in the allTickets/txHashToTicket
          // selectors. I'm getting some errors here on some wallets while testing
          // split tickets and non-standard voting layouts, so I'm leaving this and
          // the filter for the moment.
          return null;
        }
        if (ticketDecoded.ticketPrice)
          tx.ticketPrice = ticketDecoded.ticketPrice;
        if (ticketDecoded.status != "voted") {
          tx.status = ticketDecoded.status;
        }
        if (ticketDecoded.enterTimestamp)
          tx.enterTimestamp = ticketDecoded.enterTimestamp;
        if (ticketDecoded.leaveTimestamp)
          tx.leaveTimestamp = ticketDecoded.leaveTimestamp;
        if (ticketDecoded.ticketReward)
          tx.ticketReward = ticketDecoded.ticketReward;

        return tx;
      })
      .filter((v) => !!v);
  }
);

export const viewableTransactions = createSelector(
  [transactions, homeHistoryTransactions, homeHistoryTickets],
  (transactions, homeTransactions, homeHistoryTickets) => [
    ...transactions,
    ...homeTransactions,
    ...homeHistoryTickets
  ]
);
export const viewedTransaction = createSelector(
  [
    viewableTransactions,
    (
      state,
      {
        match: {
          params: { txHash }
        }
      }
    ) => txHash,
    txHashToTicket
  ],
  (transactions, txHash, txHashToTicket) => {
    const ticketDecoded = txHashToTicket[txHash];
    const tx = find({ txHash }, transactions);
    if (ticketDecoded) {
      if (ticketDecoded.ticketPrice) tx.ticketPrice = ticketDecoded.ticketPrice;
      if (ticketDecoded.status != "voted") {
        tx.status = ticketDecoded.status;
      }
      if (ticketDecoded.enterTimestamp)
        tx.enterTimestamp = ticketDecoded.enterTimestamp;
      if (ticketDecoded.leaveTimestamp)
        tx.leaveTimestamp = ticketDecoded.leaveTimestamp;
      if (ticketDecoded.ticketReward)
        tx.ticketReward = ticketDecoded.ticketReward;
    }
    return tx;
  }
);

const rescanResponse = get(["control", "rescanResponse"]);
export const rescanRequest = get(["control", "rescanRequest"]);
export const getTransactionsRequestAttempt = get([
  "grpc",
  "getTransactionsRequestAttempt"
]);
export const getTicketsRequestAttempt = get([
  "grpc",
  "getTicketsRequestAttempt"
]);
export const notifiedBlockHeight = get(["notifications", "currentHeight"]);

export const currentBlockHeight = get(["grpc", "currentBlockHeight"]);

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
                label: `${accountName}: ${
                  spendable / unitDivisor
                } ${currencyDisplay}`,
                name: accountName,
                spendableAndUnit: `${
                  spendable / unitDivisor
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
                label: `${accountName}: ${
                  spendable / unitDivisor
                } ${currencyDisplay}`,
                name: accountName,
                spendableAndUnit: `${
                  spendable / unitDivisor
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
  [spendingAccounts],
  find(compose(eq(0), get("value")))
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
export const uiAnimations = get(["settings", "uiAnimations"]);
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
export const validateAddressRequestAttempt = get([
  "control",
  "validateAddressRequestAttempt"
]);
export const validateAddressError = get(["control", "validateAddressError"]);
export const validateAddressResponse = get([
  "control",
  "validateAddressResponse"
]);
export const validateAddressSuccess = compose(
  (r) => (r ? r.toObject() : null),
  validateAddressResponse
);

export const walletMasterPubKey = get(["control", "masterPubKey"]);

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
const startAutoBuyerResponse = get(["control", "startAutoBuyerResponse"]);

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
export const currentStakePoolConfigSuccessMessage = get([
  "stakepool",
  "currentStakePoolConfigSuccessMessage"
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
export const isTicketAutoBuyerEnabled = bool(startAutoBuyerResponse);

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

const purchaseTicketsRequestAttempt = get([
  "control",
  "purchaseTicketsRequestAttempt"
]);

const importScriptRequestAttempt = get([
  "control",
  "importScriptRequestAttempt"
]);

export const isSavingStakePoolConfig = bool(currentStakePoolConfigRequest);
export const isAddingCustomStakePool = bool(
  get(["stakePool", "addCustomStakePoolAttempt"])
);
export const isPurchasingTickets = bool(purchaseTicketsRequestAttempt);
export const isImportingScript = bool(importScriptRequestAttempt);

export const newUnminedMessage = get(["notifications", "newUnminedMessage"]);

export const createWalletExisting = get([
  "walletLoader",
  "createWalletExisting"
]);

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

export const chainParams = compose(
  (isTestNet) => (isTestNet ? TestNetParams : MainNetParams),
  isTestNet
);

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
export const autobuyerRunningModalVisible = get([
  "control",
  "autobuyerRunningModalVisible"
]);

export const isTrezor = get(["trezor", "enabled"]);

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
export const trezorDeviceList = get(["trezor", "deviceList"]);
export const trezorWalletCreationMasterPubkeyAttempt = get([
  "trezor",
  "walletCreationMasterPubkeyAttempt"
]);

export const lnEnabled = bool(
  and(get(["ln", "enabled"]), not(isWatchingOnly), not(isTrezor), not(isSPV))
);
export const lnActive = bool(get(["ln", "active"]));
export const lnStartAttempt = bool(get(["ln", "startAttempt"]));
export const lnConnectAttempt = bool(get(["ln", "connectAttempt"]));
export const lnWalletExists = bool(get(["ln", "exists"]));
export const lnInfo = get(["ln", "info"]);
export const lnWalletBalances = get(["ln", "walletBalances"]);
export const lnChannelBalances = get(["ln", "channelBalances"]);
export const lnChannels = get(["ln", "channels"]);
export const lnPendingChannels = get(["ln", "pendingChannels"]);
export const lnClosedChannels = get(["ln", "closedChannels"]);
export const lnInvoices = get(["ln", "invoices"]);
export const lnPayments = get(["ln", "payments"]);
export const lnAddInvoiceAttempt = get(["ln", "addInvoiceAttempt"]);
