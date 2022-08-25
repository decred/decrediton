import { FormattedMessage as T } from "react-intl";
import { classNames, Message } from "pi-ui";
import { useDex } from "../hooks";
import { useDexCreateWallets } from "./hooks";
import { AppPassAndPassphraseModalButton } from "buttons";
import styles from "./CreateWalletsPage.module.css";

const CreateWalletsPage = () => {
  const {
    onCreateWalletDex,
    createWalletDexAttempt,
    dexDCRWalletRunning,
    dexAccount,
  } = useDex();

  const {
    onCreateWallet,
  } = useDexCreateWallets({
    dexAccount,
    onCreateWalletDex,
  });
  return (
    <div className="flex-column align-start">
      <div className={classNames(styles.subtitle, "margin-top-m")}>
        <T id="dex.subtitle.dcrWallet" m="DCR wallet" />
      </div>
      {!dexDCRWalletRunning ? (
        <div className={classNames(styles.box, "justify-center")}>
          <AppPassAndPassphraseModalButton
            disabled={createWalletDexAttempt}
            modalTitle={<T id="dex.createDCRWallet" m="Connect DCR Wallet" />}
            loading={createWalletDexAttempt}
            onSubmit={onCreateWallet}
            buttonLabel={
              <T
                id="dex.createWalletDCRPassphraseButton"
                m="Connect DCR Wallet"
              />
            }
          />
        </div>
      ) : (
        <div className={styles.box}>
          <Message kind="success">
            <T
              id="dex.dcrWalletConnected"
              m="DCR Wallet has been successfully connected!"
            />
          </Message>
        </div>
      )}
    </div>
  );
};

export default CreateWalletsPage;
