// Constants copied from dcrd/chaincfg/params.go

export const TestNetParams = {
  TicketMaturity:          16,
  TicketExpiry:            6144, // 6*TicketPoolSize
  CoinbaseMaturity:        16,
  SStxChangeMaturity:      1,
  GenesisTimestamp:        1489550400,
  TargetTimePerBlock:      2 * 60, // in seconds
};

export const MainNetParams = {
  TicketMaturity:          256,
  TicketExpiry:            40960, // 5*TicketPoolSize
  CoinbaseMaturity:        256,
  SStxChangeMaturity:      1,
  GenesisTimestamp:        1454954400,
  TargetTimePerBlock:      5 * 60, // in seconds
};
