import { useDaemonStartup } from "hooks";

export const useLedgerLoaderBarContainer = () => {
  const { ledgerDevice } = useDaemonStartup();

  return { ledgerDevice };
};
