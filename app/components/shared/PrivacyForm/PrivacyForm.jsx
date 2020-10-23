import { FormattedMessage as T } from "react-intl";
import { TextInput, NumericInput } from "inputs";
import { classNames } from "pi-ui";
import style from "./PrivacyForm.module.css";
import { usePrivacyForm } from "./hooks";

const PrivacyForm = ({
  className
}) => {
  const {
    mixedAccountName,
    changeAccountName,
    csppServer,
    csppPort,
    mixedAccountBranch
  } = usePrivacyForm();

  return (
    <div className={className ? className : null}>
      <div className={classNames(style.isRow, style.row)}>
        <div className={classNames(style.isRow, style.item)}>
          <div className={""}>
            <T id="privacy.mixing.account" m="Mixing Account" />:
          </div>
          <TextInput required disabled value={mixedAccountName} />
        </div>
        <div className={style.item}>
          <div className={style.isRow}>
            <div className={""}>
              <T id="privacy.mixing.account.branch" m="Account Branch" />:
            </div>
            <NumericInput value={mixedAccountBranch} disabled />
          </div>
        </div>
      </div>
      <div className={classNames(style.isRow, style.row)}>
        <div className={classNames(style.isRow, style.item)}>
          <div className={""}>
            <T id="privacy.change.account" m="Change Account" />:
          </div>
          <TextInput required disabled value={changeAccountName} />
        </div>
      </div>
      <div className={classNames(style.isRow, style.row)}>
        <div className={classNames(style.isRow, style.item)}>
          <div className={""}>
            <T id="privacy.mixing.server" m="Shuffle Server" />:
          </div>
          <TextInput required disabled value={csppServer} />
        </div>
        <div className={classNames(style.isRow, style.item)}>
          <div className={""}>
            <T id="privacy.mixing.server.port" m="Shuffle Port" />:
          </div>
          <TextInput required disabled value={csppPort} />
        </div>
      </div>
    </div>
  );
};

export default PrivacyForm;
