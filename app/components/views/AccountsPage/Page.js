import Accounts from "./Accounts";
import AddAccount from "./AddAccount";
import ErrorScreen from "ErrorScreen";
import "style/Layout.less";
import "style/AccountsPage.less";

const Page = ({
  walletService,
  isShowingAddAccount,
  onToggleAddAccount
}) => (
  !walletService ? <ErrorScreen/> :
  <Aux>
    { isShowingAddAccount ?
    <AddAccount onAction={onToggleAddAccount} /> :
    <Accounts {...{ onToggleAddAccount }} /> }
  </Aux>
);

export default Page;
