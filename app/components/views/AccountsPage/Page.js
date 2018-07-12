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

Page.propTypes = {
  walletService: PropTypes.object.isRequired,
  isCreateAccountDisabled: PropTypes.bool.isRequired,
};

export default Page;
