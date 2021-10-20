import { FormattedMessage as T } from "react-intl";
import { VSPSelect, AccountsSelect } from "inputs";
import { PassphraseModal } from "modals";
import styles from "./SyncVSPFailedTickets.module.css";
import { classNames } from "pi-ui";

const SyncVSPFailedTickets = ({
  account,
  setVSP,
  setAccount,
  onSubmit,
  show,
  props,
  onCancelModal,
  value,
  options
}) => (
  <PassphraseModal {...{ show, onSubmit, onCancelModal, ...props }}>
    <label className={classNames(styles.label, "selectWithBigFont")}>
      <T id="syncVsp.vsp" m="VSP Select" />
      <VSPSelect
        className="stakepool-purchase-ticket-input-select"
        {...{ account, onChange: setVSP, value, options }}
      />
    </label>
    <div className={classNames("margin-top-m", "margin-bottom-s")}>
      <label className={classNames(styles.label, "selectWithBigFont")}>
        <T id="syncVsp.account" m="Account" />
        <AccountsSelect
          selectClassName={styles.accountSelectInput}
          {...{ account, onChange: setAccount }}
        />
      </label>
    </div>
  </PassphraseModal>
);

export default SyncVSPFailedTickets;
