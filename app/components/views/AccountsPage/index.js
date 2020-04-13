import { TabbedPage, TabbedPageTab as Tab, TitleHeader, StandaloneHeader } from "layout";
import { Switch, Redirect } from "react-router-dom";
import { FormattedMessage as T } from "react-intl";
import AccountsTab from "./Accounts";
import PrivacyTab from "./Privacy";
import { PassphraseModalButton } from "buttons";
import { AddAccountModal } from "modals";
import { WatchOnlyWarnNotification } from "shared";

const AccountsListHeader = ({ onGetNextAccountAttempt, isCreateAccountDisabled }) => <StandaloneHeader
  title={<T id="accounts.title" m=" Accounts" />}
  description={<T id="accounts.description" m={"Accounts allow you to keep separate records of your DCR funds.\nTransferring DCR across accounts will create a transaction on the blockchain."}/>}
  iconClassName="accounts"
  actionButton={
    <WatchOnlyWarnNotification isActive={isCreateAccountDisabled}>
      <PassphraseModalButton
        disabled={isCreateAccountDisabled}
        modalTitle={<T id="accounts.newAccountConfirmations" m="Create new account" />}
        modalComponent={AddAccountModal}
        onSubmit={onGetNextAccountAttempt}
        buttonLabel={<T id="accounts.addNewButton" m="Add New" />}
      />
    </WatchOnlyWarnNotification>
  }
/>;

export default () => (
  <TabbedPage header={<AccountsListHeader />} >
    <Switch><Redirect from="/accounts" exact to="/accounts/list" /></Switch>
    <Tab path="/accounts/list" component={AccountsTab} link={<T id="tickets.tab.purchase" m="List Accounts"/>}/>
    <Tab path="/accounts/privacy" component={PrivacyTab} link={<T id="tickets.tab.mytickets" m="Privacy"/>}/>
  </TabbedPage>
);
