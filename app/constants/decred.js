export const MAX_POSSIBLE_FEE_INPUT = 0.1;

export const MIN_RELAY_FEE = 0.0001;
export const MIN_RELAY_FEE_ATOMS = 10000;

export const MIN_MIX_DENOMINATION = 1 << 18; // 000.00262144
export const MIN_MIX_DENOMINATION_ATOMS = 262144;

// Constants copied from dcrd/chaincfg/params.go

export const TestNetParams = {
  TicketMaturity: 16,
  TicketExpiry: 6144, // 6*TicketPoolSize
  CoinbaseMaturity: 16,
  SStxChangeMaturity: 1,
  GenesisTimestamp: 1489550400,
  TargetTimePerBlock: 2 * 60, // in seconds
  WorkDiffWindowSize: 144,

  // no way to know which one the wallet is using right now, so we record both
  // types for the moment.
  LegacyHDCoinType: 11,
  HDCoinType: 1,

  TreasuryAddress: "TcrypGAcGCRVXrES7hWqVZb5oLJKCZEtoL1",
  trezorCoinName: "Decred Testnet",

  // Address encoding magics
  NetworkAddressPrefix: "T",
  PubKeyAddrID: Buffer.from([0x28, 0xf7]), // starts with Tk
  PubKeyHashAddrID: Buffer.from([0x0f, 0x21]), // starts with Ts
  PKHEdwardsAddrID: [0x0f, 0x01], // starts with Te
  PKHSchnorrAddrID: [0x0e, 0xe3], // starts with TS
  ScriptHashAddrID: [0x0e, 0xfc], // starts with Tc

  // DefaultWalletRPCListener is the default host and port that will be used
  // if the rpc server is started (currently only used when DEX is enabled).
  DefaultWalletRPCListener: "127.0.0.1:19110"
};

export const MainNetParams = {
  TicketMaturity: 256,
  TicketExpiry: 40960, // 5*TicketPoolSize
  CoinbaseMaturity: 256,
  SStxChangeMaturity: 1,
  GenesisTimestamp: 1454954400,
  TargetTimePerBlock: 5 * 60, // in seconds
  WorkDiffWindowSize: 144,

  // no way to know which one the wallet is using right now, so we record both
  // types for the moment.
  LegacyHDCoinType: 20,
  HDCoinType: 42,

  TreasuryAddress: "Dcur2mcGjmENx4DhNqDctW5wJCVyT3Qeqkx",
  trezorCoinName: "Decred",

  // Address encoding magics
  NetworkAddressPrefix: "D",
  PubKeyAddrID: [0x13, 0x86], // starts with Dk
  PubKeyHashAddrID: [0x07, 0x3f], // starts with Ds
  PKHEdwardsAddrID: [0x07, 0x1f], // starts with De
  PKHSchnorrAddrID: [0x07, 0x01], // starts with DS
  ScriptHashAddrID: [0x07, 0x1a], // starts with Dc

  // DefaultWalletRPCListener is the default host and port that will be used
  // if the rpc server is started (currently only used when DEX is enabled).
  DefaultWalletRPCListener: "127.0.0.1:9110"
};

// MAX_DCR_AMOUNT represents the maximum decred amount in atoms.
export const MAX_DCR_AMOUNT = 21e14;

// UNIT_DIVISOR represents the minimum value one decred can have in atoms.
export const UNIT_DIVISOR = 100000000;

// RedeemP2PKHSigScriptSize is the worst case (largest) serialize size
// of a transaction input script that redeems a compressed P2PKH output.
// It is calculated as:
//
//   - OP_DATA_73
//   - 72 bytes DER signature + 1 byte sighash
//   - OP_DATA_33
//   - 33 bytes serialized compressed pubkey
export const RedeemP2PKHSigScriptSize = 1 + 73 + 1 + 33;

// AtomsPerCoin is the number of atomic units in one coin.
const AtomsPerCoin = 1e8;

// MaxAmount is the maximum transaction amount allowed in atoms.
export const MaxAmount = 21e6 * AtomsPerCoin;

// P2PKHPkScriptSize is the size of a transaction output script that
// pays to a compressed pubkey hash.  It is calculated as:
//
//   - OP_DUP
//   - OP_HASH160
//   - OP_DATA_20
//   - 20 bytes pubkey hash
//   - OP_EQUALVERIFY
//   - OP_CHECKSIG
export const P2PKHPkScriptSize = 1 + 1 + 1 + 20 + 1 + 1;

// TicketCommitmentScriptSize is the size of a ticket purchase commitment
// script. It is calculated as:
//
//   - OP_RETURN
//   - OP_DATA_30
//   - 20 bytes P2SH/P2PKH
//   - 8 byte amount
//   - 2 byte fee range limits
export const TicketCommitmentScriptSize = 1 + 1 + 20 + 8 + 2;

// DefaultRelayFeePerKb is the default minimum relay fee policy for a mempool.
export const DefaultRelayFeePerKb = 1e4;
// STEcdsaSecp256k1 specifies that the signature is an ECDSA signature
// over the secp256k1 elliptic curve.
export const STEcdsaSecp256k1 = 0;

// STEd25519 specifies that the signature is an ECDSA signature over the
// edwards25519 twisted Edwards curve.
export const STEd25519 = 1;

// STSchnorrSecp256k1 specifies that the signature is a Schnorr
// signature over the secp256k1 elliptic curve.
export const STSchnorrSecp256k1 = 2;

// ripemd160Size is the size of the RIPEMD-160 hash algorithm checksum in bytes.
export const ripemd160Size = 20;

// SStxPKHMinOutSize is the minimum size of an OP_RETURN commitment output
// for an SStx tx.
// 20 bytes P2SH/P2PKH + 8 byte amount + 4 byte fee range limits
export const SStxPKHMinOutSize = 32;

// Due processing issues we only validate addresses for transactions that have
// less than 10 non wallet outputs.  We also limit listing addresses on
// the transaction details when over this amount.
export const MaxNonWalletOutputs = 10;

// Sanctioned Politeia keys.
// Only showing the first Pi trusted key for now.
export const PiKeys = [
  "03f6e7041f1cf51ee10e0a01cd2b0385ce3cd9debaabb2296f7e9dee9329da946c"
  // "0319a37405cb4d1691971847d7719cfce70857c0f6e97d7c9174a3998cf0ab86dd",
];
