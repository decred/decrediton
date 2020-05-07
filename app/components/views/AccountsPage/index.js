import { TabbedPage, TabbedPageTab as Tab, StandaloneHeader } from "layout";
import { Switch, Redirect } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import AccountsTab from "./Accounts";
import PrivacyTab from "./Privacy";
import { PassphraseModalButton } from "buttons";
import { AddAccountModal } from "modals";
import { WatchOnlyWarnNotification } from "shared";
import { useSelector, useDispatch } from "react-redux";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";

function Main() {
  const dispatch = useDispatch();
  const privacyEnabled = useSelector(sel.getPrivacyEnabled);
  const isCreateAccountDisabled = useSelector(sel.isWatchingOnly);
  const onGetNextAccountAttempt = (passphrase, name) =>
    dispatch(ca.getNextAccountAttempt(passphrase, name));

  const AccountsListHeader = () => (
    <StandaloneHeader
      title={<T id="accounts.title" m=" Accounts" />}
      description={
        <T
          id="accounts.description"
          m={
            "Accounts allow you to keep separate records of your DCR funds.\nTransferring DCR across accounts will create a transaction on the blockchain."
          }
        />
      }
      iconClassName="accounts"
      actionButton={
        <WatchOnlyWarnNotification isActive={isCreateAccountDisabled}>
          <PassphraseModalButton
            disabled={isCreateAccountDisabled}
            modalTitle={
              <T id="accounts.newAccountConfirmations" m="Create new account" />
            }
            modalComponent={AddAccountModal}
            onSubmit={onGetNextAccountAttempt}
            buttonLabel={<T id="accounts.addNewButton" m="Add New" />}
          />
        </WatchOnlyWarnNotification>
      }
    />
  );

  return (
    <TabbedPage header={<AccountsListHeader />}>
      <Switch>
        <Redirect from="/accounts" exact to="/accounts/list" />
      </Switch>
      <Tab
        path="/accounts/list"
        component={AccountsTab}
        link={<T id="accounts.tab.listAccounts" m="List Accounts" />}
      />
      <Tab
        path="/accounts/privacy"
        component={<PrivacyTab {...{ isCreateAccountDisabled }} />}
        link={<T id="accounts.tab.privacy" m="Privacy" />}
        disabled={!privacyEnabled}
      />
    </TabbedPage>
  );
}

export default Main;
