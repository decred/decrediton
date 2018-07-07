import Accounts from "./Accounts";
import ErrorScreen from "ErrorScreen";
import "style/AccountsPage.less";

const Page = ({
  walletService,
  isCreateAccountDisabled,
}) => (
  !walletService ? <ErrorScreen/> :
    <Accounts {...{ isCreateAccountDisabled }}/>
);

export default Page;
