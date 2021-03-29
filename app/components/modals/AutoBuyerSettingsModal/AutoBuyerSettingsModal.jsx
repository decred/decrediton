import { FormattedMessage as T } from "react-intl";
import Modal from "../Modal";
import styles from "./AutoBuyerSettingsModal.module.css";
import { DcrInput, AccountsSelect, VSPSelect } from "inputs";
import { PiUiButton, InvisiblePiUiButton } from "buttons";

const AutoBuyerSettingsModal = ({
  onCancelModal,
  onSubmit,
  show,
  balanceToMaintain,
  setBalanceToMaintain,
  account,
  setAccount,
  vsp,
  setVsp,
  availableVSPs,
  notMixedAccounts,
  isValid,
  clicked
}) => {
  return (
    <Modal className={styles.modal} {...{ show }}>
      <div className={styles.title}>
        <T id="autoBuyerSettings.header" m="Automatic ticket purchases" />
      </div>
      <div className={styles.infoCloseButtonTop} onClick={onCancelModal} />
      <label className={styles.label}>
        <T id="vsp.autobuyer.balanceToMaintain" m="Balance to Maintain" />
        <DcrInput
          amount={balanceToMaintain?.value}
          onChangeAmount={setBalanceToMaintain}
        />
      </label>
      <label className={styles.label}>
        <T id="vsp.autobuyer.accountFrom" m="From" />
        <AccountsSelect
          {...{ account }}
          onChange={setAccount}
          showAccountsButton={false}
          hideSpendable={true}
          filterAccounts={notMixedAccounts}
        />
      </label>
      <label className={styles.label}>
        <T id="vsp.autobuyer.stakePoolLabel" m="VSP" />
        <VSPSelect options={availableVSPs} value={vsp} onChange={setVsp} />
      </label>
      {clicked && isValid === false && (
        <div className={styles.error}>
          <T id="autobuyer.startErr" m="Fill all fields." />
        </div>
      )}
      <div className={styles.buttons}>
        <InvisiblePiUiButton onClick={onCancelModal}>
          <T id="autoBuyerSettings.cancel" m="Cancel" />
        </InvisiblePiUiButton>
        <PiUiButton
          onClick={() => onSubmit(balanceToMaintain, account, vsp)}>
          <T id="autoBuyerSettings.save" m="Save" />
        </PiUiButton>
      </div>
    </Modal>
  );
};

export default AutoBuyerSettingsModal;
