import { FormattedMessage as T } from "react-intl";
import { TextInput } from "inputs";
import { classNames } from "pi-ui";
import style from "./PrivacyForm.module.css";
import { usePrivacyForm } from "./hooks";

const PrivacyForm = ({ className }) => {
  const {
    mixedAccountName,
    changeAccountName,
    csppServer,
    csppPort,
    mixedAccountBranch
  } = usePrivacyForm();

  return (
    <div className={classNames(className, style.privacyForm)}>
      <label htmlFor="mixedAccountName">
        <T id="privacy.mixing.account" m="Mixed Account" />
      </label>
      <TextInput
        required
        disabled
        value={mixedAccountName}
        id="mixedAccountName"
        className={style.textInput}
      />
      <label htmlFor="changeAccountName">
        <T id="privacy.change.account" m="Unmixed Account" />
      </label>
      <TextInput
        required
        disabled
        value={changeAccountName}
        id="changeAccountName"
        className={style.textInput}
      />
      <label htmlFor="accountBranch" className={style.accountBranchLabel}>
        <T id="privacy.mixing.account.branch" m="Account Branch" />
      </label>
      <TextInput
        required
        disabled
        value={mixedAccountBranch}
        id="accountBranch"
        className={classNames(style.textInput, style.accountBranch)}
      />
      <label htmlFor="csppServer">
        <T id="privacy.mixing.server" m="Shuffle Server" />
      </label>
      <TextInput
        required
        disabled
        value={csppServer}
        id="csppServer"
        className={style.textInput}
      />
      <label htmlFor="csppPort">
        <T id="privacy.mixing.server.port" m="Shuffle Port" />
      </label>
      <TextInput
        required
        disabled
        value={csppPort}
        id="csppPort"
        className={style.textInput}
      />
    </div>
  );
};

export default PrivacyForm;
