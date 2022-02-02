import { FormattedMessage as T, defineMessages } from "react-intl";
import Modal from "../Modal";
import styles from "./AutoBuyerSettingsModal.module.css";
import { DcrInput, AccountsSelect, FloatInput } from "inputs";
import { PiUiButton, InvisiblePiUiButton } from "buttons";
import { classNames } from "pi-ui";
import { useIntl } from "react-intl";

const messages = defineMessages({
  balanceToMaintainPlaceholder: {
    id: "vsp.autobuyer.balanceToMaintain.placeholder",
    defaultMessage: "Amount"
  },
  balanceToMaintainLabel: {
    id: "vsp.autobuyer.balanceToMaintain",
    defaultMessage: "Balance to Maintain"
  },
  maxFeePercentagePlaceholder: {
    id: "vsp.autobuyer.maxFeePercentage.placeholder",
    defaultMessage: "Percent"
  },
  maxFeePercentageLabel: {
    id: "vsp.autobuyer.maxFeePercentage.label",
    defaultMessage: "Maximum Fee"
  }
});

const AutoBuyerSettingsModal = ({
  onCancelModal,
  onSubmit,
  show,
  balanceToMaintain,
  setBalanceToMaintain,
  account,
  setAccount,
  isGetVSPAttempt,
  vsp,
  notMixedAccounts,
  isValid,
  errorMsg,
  clicked,
  VSPSelectControl,
  maxFeePercentage,
  setMaxFeePercentage
}) => {
  const intl = useIntl();
  return (
    <Modal className={styles.modal} {...{ show }}>
      <div className={styles.title}>
        <T id="autoBuyerSettings.header" m="Automatic ticket purchases" />
      </div>
      <div className={styles.infoCloseButtonTop} onClick={onCancelModal} />
      <DcrInput
        newBiggerFontStyle
        id="balanceToMaintainInput"
        amount={balanceToMaintain?.value}
        onChangeAmount={setBalanceToMaintain}
        className={styles.balanceToMaintainInput}
        placeholder={intl.formatMessage(messages.balanceToMaintainPlaceholder)}
        label={intl.formatMessage(messages.balanceToMaintainLabel)}
      />
      <label className={styles.label}>
        <T id="vsp.autobuyer.accountFrom" m="From" />
        <AccountsSelect
          {...{ account }}
          selectWithBigFont
          onChange={setAccount}
          showAccountsButton={false}
          hideSpendable={true}
          filterAccounts={notMixedAccounts}
        />
      </label>
      {VSPSelectControl && (
        <label className={classNames(styles.label, "selectWithBigFont")}>
          <T id="vsp.autobuyer.stakePoolLabel" m="VSP" />
          {VSPSelectControl}
        </label>
      )}

      {setMaxFeePercentage && (
        <FloatInput
          newBiggerFontStyle
          id="maxFeePercentage"
          value={maxFeePercentage}
          onChange={(e) => setMaxFeePercentage(e.target.value)}
          className={styles.maxFeePercentage}
          placeholder={intl.formatMessage(messages.maxFeePercentagePlaceholder)}
          label={intl.formatMessage(messages.maxFeePercentageLabel)}
          unit="%"
        />
      )}
      {clicked && isValid === false && (
        <div className={styles.error}>
          {errorMsg ? (
            errorMsg
          ) : (
            <T id="autobuyer.startErr" m="Fill all fields." />
          )}
        </div>
      )}
      <div className={styles.buttons}>
        <InvisiblePiUiButton onClick={onCancelModal}>
          <T id="autoBuyerSettings.cancel" m="Cancel" />
        </InvisiblePiUiButton>
        <PiUiButton
          loading={isGetVSPAttempt}
          disabled={isGetVSPAttempt}
          onClick={() =>
            onSubmit({
              ...{ balanceToMaintain, account, vsp, maxFeePercentage }
            })
          }>
          <T id="autoBuyerSettings.save" m="Save" />
        </PiUiButton>
      </div>
    </Modal>
  );
};

export default AutoBuyerSettingsModal;
