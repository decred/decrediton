export const ERR_INVALID_ADDR_EMPTY = "ERR_INVALID_ADDR_EMPTY";
export const ERR_INVALID_ADDR_TOOSHORT = "ERR_INVALID_ADDR_TOOSHORT";
export const ERR_INVALID_ADDR_TOOLONG = "ERR_INVALID_ADDR_TOOLONG";
export const ERR_INVALID_ADDR_NETWORKPREFIX = "ERR_INVALID_ADDR_NETWORKPREFIX";

// isValidAddress performs a simple set of validations for a given address in
// the given network (either testnet or mainnet). Note that this is not a full
// script validation, only some simple checks are performed.
//
// Returns an error identifier or null if the address is valid.
//
// TODO: implement full decred address validation.
export function isValidAddress(addr, network) {
  if (!addr || !addr.trim().length) return ERR_INVALID_ADDR_EMPTY;
  if (addr.length < 25) return ERR_INVALID_ADDR_TOOSHORT;
  if (addr.length > 36) return ERR_INVALID_ADDR_TOOLONG;

  if (network === "testnet" && addr[0] !== "T") return ERR_INVALID_ADDR_NETWORKPREFIX;
  if (network === "mainnet" && addr[0] !== "D") return ERR_INVALID_ADDR_NETWORKPREFIX;
  return null;
}
