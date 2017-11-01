// @flow
import Header from "./Header";
import { FormattedMessage as T } from "react-intl";
import "style/Layout.less";
import "style/SecurityCenterMessagePage.less";
import SignMessageForm from "./Forms/SignMessageForm";
import VerifyMessageForm from "./Forms/VerifyMessageForm";

const Page = ({
  ...props,
  form,
  onSetForm,
  formatMessage,
  onSubmitSignMessage,
  onShowSignMessageInfo,
  onSubmitVerifyMessage,
  onShowVerifyMessageInfo,
}) => {
  const { signMessageSuccess, signMessageError, verifyMessageSuccess, verifyMessageError } = props;

  return (
    <div className="page-view">
      <Header
        headerTitleOverview={<T id="invalidRPCVersion.title" m="Invalid RPC Version" />}
      />
      <div className="page-content message message-sign">
        <div className="security-page-toggle">
          <div className="text-toggle">
            <div className={`text-toggle-button-left ${form === 0 ? "text-toggle-button-active" : null}`}
              onClick={()=>onSetForm(0)}
            >
              <T id="securitycenter.header.toggle.sign" m="Sign" />
            </div>
            <div className={`text-toggle-button-right ${form === 1 ? "text-toggle-button-active" : null}`}
              onClick={()=>onSetForm(1)}

            >
              <T id="securitycenter.header.toggle.verify" m="Verify" />
            </div>
          </div>
        </div>
        {
          form === 0 ? <SignMessageForm {...{
            formatMessage,
            onSubmitSignMessage,
            onShowSignMessageInfo,
            signMessageSuccess,
            signMessageError,
          }} /> :
            form === 1 ? <VerifyMessageForm {...{
              formatMessage,
              onSubmitVerifyMessage,
              onShowVerifyMessageInfo,
              verifyMessageSuccess,
              verifyMessageError,
            }} />
              : null
        }
      </div>
    </div>
  );
};

export default Page;
