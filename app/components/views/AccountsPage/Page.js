import React from "react";
import Accounts from "./Accounts";
import AddAccount from "./AddAccount";
import { AccountStyles } from "../ViewStyles.js";
import SideBar from "../../SideBar";
import ErrorScreen from "../../ErrorScreen";

const Page = ({
  walletService,
  isShowingAddAccount,
  onHideAddAccount,
  onShowAddAccount
}) => (
  walletService ? (
    <div style={AccountStyles.body}>
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
