import React from "react";
import SideBar from "../../SideBar";
import TxDetails from "./../TxDetails";

const Page = ({ transactionDetails }) => (
  <div className="page-body">
    <SideBar />
    {transactionDetails ? (
      <TxDetails tx={transactionDetails} />
    ) : <p>Transaction not found</p>}
  </div>
);

export default Page;
