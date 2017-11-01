// @flow
import Header from "./Header";
import { FormattedMessage as T } from "react-intl";
import FormSelector from "./FormSelector";
import SignMessageInfo from "SignMessageInfo";
import VerifyMessageInfo from "VerifyMessageInfo";

const Page = ({
  ...props,
  ...state,
  form,
  onSetForm,
  formatMessage,
  onSubmitSignMessage,
  onShowSignMessageInfo,
  onSubmitVerifyMessage,
  onShowVerifyMessageInfo,
}) => {
  const { signMessageSuccess, signMessageError, verifyMessageSuccess, verifyMessageError } = props;
  const { isShowingSignMessageInfo, isShowingVerifyMessageInfo } = state;

  return (
    <div className="page-view">
      <Header
        headerTitleOverview={<T id="invalidRPCVersion.title" m="Invalid RPC Version" />}
      />
      <div className="page-content message message-sign">
        {
          isShowingSignMessageInfo ? <SignMessageInfo /> :
            isShowingVerifyMessageInfo ? <VerifyMessageInfo /> :
              <FormSelector {...{
                form,
                onSetForm,
                formatMessage,
                onSubmitSignMessage,
                onShowSignMessageInfo,
                onSubmitVerifyMessage,
                onShowVerifyMessageInfo,
              }} />
        }
      </div>
    </div>
  );
};

export default Page;
