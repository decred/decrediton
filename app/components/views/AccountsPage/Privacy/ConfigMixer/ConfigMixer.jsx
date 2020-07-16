import { FormattedMessage as T } from "react-intl";
import { Subtitle } from "shared";
import { classNames } from "pi-ui";
import style from "../Privacy.module.css";
import { useConfigMixer } from "./hooks";
import CreateDefaultAccounts from "./CreateDefaultAccounts";
import CreateNeededAccounts from "./CreateNeededAccounts";

const ConfigMixer = ({ isCreateAccountDisabled, accounts }) => {
  const {
    areAccountsAvailable,
    mixedAccountName,
    setMixedAccountName,
    changeAccountName,
    setChangeAccountName,
    onSubmit,
    isValid
  } = useConfigMixer(accounts);

  return (
    <>
      <Subtitle
        title={<T id="privacy.config.subtitle" m="Privacy Configuration" />}
      />
      <div className={classNames(style.pageWrapper, style.isColumn)}>
        {areAccountsAvailable ? (
          <CreateNeededAccounts
            {...{
              onSubmit,
              mixedAccountName,
              changeAccountName,
              setMixedAccountName,
              setChangeAccountName,
              isValid,
              isCreateAccountDisabled
            }}
          />
        ) : (
          <CreateDefaultAccounts
            {...{
              onSubmit,
              mixedAccountName,
              changeAccountName,
              setMixedAccountName,
              setChangeAccountName,
              isValid,
              isCreateAccountDisabled
            }}
          />
        )}
      </div>
    </>
  );
};

export default ConfigMixer;
