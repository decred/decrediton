export const mockVspInfo = {
  data: {
    pubkey: "test-pubkey",
    feepercentage: 2
  }
};
export const mockAvailableVsps = [
  {
    host: "https://test-stakepool1.eu",
    label: "https://test-stakepool1.eu",
    vspData: {
      feepercentage: 1,
      vspdversion: "1.1.0"
    }
  },
  {
    host: "https://test-stakepool2.eu",
    label: "https://test-stakepool2.eu",
    vspData: {
      feepercentage: 2,
      vspdversion: "1.1.0"
    }
  },
  {
    host: "https://test-stakepool3.eu",
    label: "https://test-stakepool3.eu",
    outdated: true,
    vspData: {
      feepercentage: 3,
      vspdversion: "1.0.0" // outdated
    }
  }
];
export const mockMixedAccountValue = 6;
export const mockChangeAccountValue = 6;
export const mockNumTicketsToBuy = 1;
export const mockMixedAccount = {
  hidden: false,
  label: "mixed: 249.79547928 DCR",
  name: "mixed",
  spendable: 24979547928,
  spendableAndUnit: "249.79547928 DCR",
  total: 24979547928,
  value: mockMixedAccountValue
};
