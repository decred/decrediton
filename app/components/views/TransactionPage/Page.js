import React from "react";
import TxDetails from "./../TxDetails";

const Page = ({ transactionDetails }) => (
  <div>
    {transactionDetails ? (
      <TxDetails tx={transactionDetails} />
    ) : <p>Transaction not found</p>}
  </div>
);

export default Page;
