import Accounts from "./Accounts";
import AddAccount from "./AddAccount";
import ErrorScreen from "ErrorScreen";
import "style/Layout.less";
import "style/AccountsPage.less";

const Page = ({
  routes,
  walletService,
  isShowingAddAccount,
  onToggleAddAccount
}) => (
  !walletService ? <ErrorScreen/> :
  <Aux>
    { isShowingAddAccount ?
    <AddAccount onAction={onToggleAddAccount} {...{ routes }} /> :
    <Accounts {...{ onToggleAddAccount, routes }} /> }
  </Aux>
);

export default Page;
