import React from "react";
import Accounts from "./Accounts";
import AddAccount from "./AddAccount";
import ErrorScreen from "../../ErrorScreen";
import "../../../style/Layout.less";
import "../../../style/AccountsPage.less";

const Page = ({
  walletService,
  isShowingAddAccount,
  onHideAddAccount,
  onShowAddAccount
}) => (
  walletService ? (
    <div>
      {isShowingAddAccount ? (
        <AddAccount onSave={onHideAddAccount} onCancel={onHideAddAccount} />
      ) : (
        <Accounts {...{ onShowAddAccount }} />
      )}
    </div>
  ) : (
    <ErrorScreen />
  )
);

export default Page;
