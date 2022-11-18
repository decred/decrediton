import { SendTransaction } from "shared";
import ErrorScreen from "ErrorScreen";
import { FormattedMessage as T } from "react-intl";
import { DescriptionHeader } from "layout";
import { useService } from "hooks";
import styles from "./SendForm.module.css";
import { Subtitle } from "shared";
import { ListUTXOsButton } from "buttons";
import SendOutputRow from "./SendOutputRow";

export const SendTabHeader = () => {
  const { isTestNet } = useService();
  return (
    <DescriptionHeader
      description={
        isTestNet ? (
          <T
            id="transactions.description.send.testnet"
            m={
              "Testnet Decred addresses always begin with letter T and contain 26-35 alphanumeric characters\n(e.g. TxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0)."
            }
          />
        ) : (
          <T
            id="transactions.description.send.mainnet"
            m={
              "Mainnet Decred addresses always begin with letter D and contain 26-35 alphanumeric characters\n(e.g. DxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X)."
            }
          />
        )
      }
    />
  );
};

const SendTab = () => {
  const { walletService } = useService();

  return !walletService ? (
    <ErrorScreen />
  ) : (
    <>
      <Subtitle
        title={<T id="send.subtitle" m="Send DCR" />}
        className={"flex-row"}
        children={<ListUTXOsButton />}
        docUrl="https://docs.decred.org/wallets/decrediton/using-decrediton/#send"
      />
      <SendTransaction styles={styles} SendOutputRow={SendOutputRow} />
    </>
  );
};

export default SendTab;
