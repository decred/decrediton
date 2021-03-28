import { FormattedMessage as T } from "react-intl";
import Modal from "../Modal";
import styles from "./AutoBuyerSettingsModal.module.css";
import { Button } from "pi-ui";
import { DcrInput, AccountsSelect, VSPSelect } from "inputs";

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
      <label>
        <T id="vsp.autobuyer.balanceToMaintain" m="Balance to Maintain" />:
        <DcrInput
          amount={balanceToMaintain?.value}
          onChangeAmount={setBalanceToMaintain}
        />
      </label>
      <label>
        <T id="vsp.autobuyer.accountFrom" m="From" />:
        <AccountsSelect
          {...{ account }}
          onChange={setAccount}
          showAccountsButton={false}
          hideSpendable={true}
          filterAccounts={notMixedAccounts}
        />
      </label>
      <label>
        <T id="vsp.autobuyer.stakePoolLabel" m="VSP" />:
        <VSPSelect options={availableVSPs} value={vsp} onChange={setVsp} />
      </label>
      {clicked && isValid === false && (
        <div className={styles.error}>
          <T id="autobuyer.startErr" m="Fill all fields." />
        </div>
      )}
      <div>
        <Button
          className={styles.cancelButton}
          onClick={onCancelModal}
          kind="secondary">
          <T id="autoBuyerSettings.cancel" m="Cancel" />
        </Button>
        <Button
          className={styles.saveButton}
          onClick={() => onSubmit(balanceToMaintain, account, vsp)}>
          <T id="autoBuyerSettings.save" m="Save" />
        </Button>
      </div>
    </Modal>
  );
};

export default AutoBuyerSettingsModal;
