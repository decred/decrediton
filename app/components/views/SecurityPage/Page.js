// @flow
import Header from "./Header";
import { FormattedMessage as T } from "react-intl";
import FormSelector from "./FormSelector";
import SignMessageInfo from "SignMessageInfo";
import VerifyMessageInfo from "VerifyMessageInfo";

const Page = ({
  ...props,
  isShowingSignMessageInfo,
  isShowingVerifyMessageInfo,
  form,
  onSetForm,
  formatMessage,
  onSubmitSignMessage,
  onShowSignMessageInfo,
  onSubmitVerifyMessage,
  onShowVerifyMessageInfo,
  onHideVerifyMessageInfo,
  onHideSignMessageInfo,
}) => {
  const { signMessageSuccess, signMessageError, verifyMessageSuccess, verifyMessageError } = props;

  return (
    <div className="page-view">
      <Header
        headerTitleOverview={<T id="invalidRPCVersion.title" m="Invalid RPC Version" />}
      />
      {
        isShowingSignMessageInfo ? <SignMessageInfo closeModal={onHideSignMessageInfo} /> :
          isShowingVerifyMessageInfo ? <VerifyMessageInfo closeModal={onHideVerifyMessageInfo} /> :
            <div className="page-content message message-sign">
              <FormSelector {...{
                form,
                onSetForm,
                formatMessage,
                onSubmitSignMessage,
                onShowSignMessageInfo,
                onSubmitVerifyMessage,
                onShowVerifyMessageInfo,
                signMessageSuccess,
                signMessageError,
                verifyMessageSuccess,
                verifyMessageError
              }} />
            </div>
      }
    </div>
  );
};

export default Page;
