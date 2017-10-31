// @flow
import Header from "./Header";
import { FormattedMessage as T } from "react-intl";
import "style/Layout.less";
import "style/SecurityCenterMessagePage.less";
import SignMessageForm from "./Forms/SignMessageForm"

const Page = ({ 
  handleSubmit,
  onSubmit,
  pristine,
  error,
  submitting,
  rpcError,
  formatMessage,
  onShowSignMessageInfo
}) => (
  <div className="page-view">
    <Header
      headerTitleOverview={<T id="invalidRPCVersion.title" m="Invalid RPC Version" />}
    />
    <div className="page-content message message-sign">
      <div className="security-page-toggle">
        <div className="text-toggle">
          <div className="text-toggle-button-left text-toggle-button-active">
            <T id="securitycenter.header.toggle.sign" m="Sign" />
          </div>
          <div className="text-toggle-button-right">
            <T id="securitycenter.header.toggle.verify" m="Verify" />
          </div>
        </div>
      </div>
      <SignMessageForm  {
        ...{
          formatMessage,
        }
      }/>

    </div>

  </div>
);

export default Page;
