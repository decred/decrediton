import React from "react";
import Header from "Header";
import KeyBlueButton from "KeyBlueButton";
import {LoginRPCRemote} from "./RemoteRPCForm";
import AppDataForm from "./AppDataForm";
import { FormattedMessage as T } from "react-intl";
import "style/LoginForm.less";

export const LoginRPCHeader = () => (
  <Header getStarted
    headerTitleOverview={<T id="getStarted.advanced.title" m="Advanced Start Up" />}
    headerMetaOverview={<T id="getStarted.advanced.meta" m="Please complete one of the following forms to start Decrediton according to your local setup." />} />
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
        <AppDataForm {...{
          ...props,
          ...state,
          onSubmitDiffAppdataForm,
          onChangeRpcappdata,
          onChangeRpccert,
          formatMessage
        }} />
      </div>
      <KeyBlueButton onClick={skipAdvancedDaemon}>
        <T id="advancedStartup.skip" m="Skip Advanced Daemon Connection"/>
      </KeyBlueButton>
    </div>
  );
};
