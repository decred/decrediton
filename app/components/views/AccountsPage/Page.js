import Accounts from "./Accounts";
import ErrorScreen from "ErrorScreen";
import "style/AccountsPage.less";

const Page = ({
  routes,
  walletService
}) => (
  !walletService ? <ErrorScreen/> :
    <Accounts {...{ routes }} />
);

export default Page;
