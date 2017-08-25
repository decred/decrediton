import React from "react";
import Accounts from "./Accounts";
import AddAccount from "./AddAccount";
import SideBar from "../../SideBar";
import ErrorScreen from "../../ErrorScreen";
import "../../../style/AccountsPage.less";

const Page = ({
  walletService,
  isShowingAddAccount,
  onHideAddAccount,
  onShowAddAccount
}) => (
  walletService ? (
    <div className="account-body">
      <SideBar />
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
