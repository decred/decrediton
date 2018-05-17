// Constants copied from dcrd/chaincfg/params.go

export const TestNetParams = {
  TicketMaturity:          16,
  TicketExpiry:            6144, // 6*TicketPoolSize
  CoinbaseMaturity:        16,
  SStxChangeMaturity:      1,
  GenesisTimestamp:        1489550400,
  TargetTimePerBlock:      2 * 60, // in seconds

  // no way to know which one the wallet is using right now, so we record both
  // types for the moment.
  LegacyHDCoinType: 11,
  HDCoinType: 1,

  WorkDiffWindowSize: 144,
};

export const MainNetParams = {
  TicketMaturity:          256,
  TicketExpiry:            40960, // 5*TicketPoolSize
  CoinbaseMaturity:        256,
  SStxChangeMaturity:      1,
  GenesisTimestamp:        1454954400,
  TargetTimePerBlock:      5 * 60, // in seconds

  // no way to know which one the wallet is using right now, so we record both
  // types for the moment.
  LegacyHDCoinType: 20,
  HDCoinType: 42,

  WorkDiffWindowSize: 144,
};
