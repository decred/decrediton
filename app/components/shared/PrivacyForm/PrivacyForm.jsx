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
    csppPort
  } = usePrivacyForm();

  return (
    <div className={className}>
      <div className={classNames(style.isRow, style.row)}>
        <div className={classNames(style.isRow, style.item)}>
          <div>
            <T id="privacy.mixing.account" m="Mixed Account" />:
          </div>
          <TextInput required disabled value={mixedAccountName} />
        </div>
        <div className={classNames(style.isRow, style.item)}>
          <div className={""}>
            <T id="privacy.change.account" m="Unmixed Account" />:
          </div>
          <TextInput required disabled value={changeAccountName} />
        </div>
      </div>
      <div className={classNames(style.isRow, style.row)}>
        <div className={classNames(style.isRow, style.item)}>
          <div>
            <T id="privacy.mixing.server" m="Shuffle Server" />:
          </div>
          <TextInput required disabled value={csppServer} />
        </div>
        <div className={classNames(style.isRow, style.item)}>
          <div>
            <T id="privacy.mixing.server.port" m="Shuffle Port" />:
          </div>
          <TextInput required disabled value={csppPort} />
        </div>
      </div>
    </div>
  );
};

export default PrivacyForm;
