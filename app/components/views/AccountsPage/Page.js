import Accounts from "./Accounts";
import ErrorScreen from "ErrorScreen";
import "style/AccountsPage.less";

const Page = ({
  walletService
}) => (
  !walletService ? <ErrorScreen/> :
    <Accounts />
);

export default Page;
