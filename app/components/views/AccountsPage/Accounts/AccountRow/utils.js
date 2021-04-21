// default account's number equals 2^31-1.
// source https://github.com/decred/dcrwallet/blob/master/wallet/udb/addressmanager.go#L43
export const isImported = ({ accountNumber }) =>
  accountNumber === Math.pow(2, 31) - 1;
