import { FormattedMessage as T } from "react-intl";
import { Subtitle } from "shared";
import { classNames } from "pi-ui";
import style from "../Privacy.module.css";
import { usePrivacy } from "../hooks";
import CreateDefaultAccounts from "./CreateDefaultAccounts";
import CreateNeededAccounts from "./CreateNeededAccounts";
import { useEffect, useState } from "react";
import { MIXED_ACCOUNT, CHANGE_ACCOUNT } from "constants";

const checkAvailableAccounts = (accounts) => {
  const mixedExists = accounts.find(
    ({ accountName }) => accountName === MIXED_ACCOUNT
  );
  const changeExists = accounts.find(
    ({ accountName }) => accountName === CHANGE_ACCOUNT
  );

  return !(mixedExists || changeExists);
};

const ConfigMixer = ({ isCreateAccountDisabled, accounts }) => {
  const areAccountsAvailable = checkAvailableAccounts(accounts);
  const [mixedAccountName, setMixedAccountName] = useState(
    areAccountsAvailable && MIXED_ACCOUNT
  );
  const [changeAccountName, setChangeAccountName] = useState(
    areAccountsAvailable && CHANGE_ACCOUNT
  );
  const [isValid, setIsValid] = useState(false);

  const { createNeededAccounts } = usePrivacy();

  useEffect(() => {
    setIsValid(mixedAccountName && changeAccountName);
  }, [mixedAccountName, changeAccountName]);

  const onSubmit = (passphrase) =>
    createNeededAccounts(passphrase, mixedAccountName, changeAccountName);

  return (
    <>
      <Subtitle
        title={<T id="privacy.config.subtitle" m="Privacy Configuration" />}
      />
      <div className={classNames(style.pageWrapper, style.isColumn)}>
        {areAccountsAvailable ? (
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
        ) : (
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
        )}
      </div>
    </>
  );
};

export default ConfigMixer;
