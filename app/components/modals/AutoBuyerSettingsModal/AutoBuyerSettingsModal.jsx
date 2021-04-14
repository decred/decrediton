import { FormattedMessage as T } from "react-intl";
import Modal from "../Modal";
import styles from "./AutoBuyerSettingsModal.module.css";
import { DcrInput, AccountsSelect } from "inputs";
import { PiUiButton, InvisiblePiUiButton } from "buttons";
import { classNames } from "pi-ui";

const AutoBuyerSettingsModal = ({
  onCancelModal,
  onSubmit,
  show,
  balanceToMaintain,
  setBalanceToMaintain,
  account,
  setAccount,
  vsp,
  notMixedAccounts,
  isValid,
  clicked,
  VSPSelectControl
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
          className={styles.balanceToMaintainInput}
        />
      </label>
      <label className={classNames(styles.label, "selectWithBigFont")}>
        <T id="vsp.autobuyer.accountFrom" m="From" />
        <AccountsSelect
          {...{ account }}
          onChange={setAccount}
          showAccountsButton={false}
          hideSpendable={true}
          filterAccounts={notMixedAccounts}
          selectClassName={styles.accountSelectInput}
        />
      </label>
      <label className={classNames(styles.label, "selectWithBigFont")}>
        <T id="vsp.autobuyer.stakePoolLabel" m="VSP" />
        {VSPSelectControl}
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
        <PiUiButton onClick={() => onSubmit(balanceToMaintain, account, vsp)}>
          <T id="autoBuyerSettings.save" m="Save" />
        </PiUiButton>
      </div>
    </Modal>
  );
};

export default AutoBuyerSettingsModal;
