import React from "react";
import Header from "Header";
import KeyBlueButton from "KeyBlueButton"
import {LoginRPCRemote} from "./RemoteRPCForm"
import {LoginDiffAppdata} from "./DiffAppdataForm"
import { FormattedMessage as T } from "react-intl";
import "style/LoginForm.less";

export const LoginRPCHeader = () => (
  <Header getStarted
    headerTitleOverview={<T id="getStarted.header.title" m="Setting up Decrediton" />}
    headerMetaOverview={<T id="getStarted.header.startRpc.meta" m="Login to your RPC" />} />
);

export const LoginFormBody = ({
  ...props,
  ...state,
  onSubmitDiffAppdataForm,
  onChangeRpcappdata,
  onSubmitRemoteForm,
  onChangeRpcuser,
  onChangeRpcpass,
  onChangeRpccert,
  skipAdvancedDaemon,
  intl: { formatMessage }
 }) => {
  return (
    <div className="login-form-wrapper">
      <div className="login-forms-wrapper">
        <LoginRPCRemote {...{
          ...props,
          ...state,
          onSubmitRemoteForm,
          onChangeRpcuser,
          onChangeRpcpass,
          onChangeRpccert,
          formatMessage
        }}
        />
        <LoginDiffAppdata {...{
          ...props,
          ...state,
          onSubmitDiffAppdataForm,
          onChangeRpcappdata,
          onChangeRpccert,
          formatMessage
        }} />
      </div>
      <KeyBlueButton onClick={skipAdvancedDaemon}>
        Skip Advanced Daemon Connection
      </KeyBlueButton>
    </div>
  )
}
