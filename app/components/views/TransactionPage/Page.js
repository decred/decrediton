import TxDetails from "../TxDetails";

const Page = ({ transactionDetails, decodedTransaction, tsDate }) => (
  <>
    { transactionDetails ?
      <TxDetails tx={transactionDetails} {...{ decodedTransaction, tsDate }}/> :
      <p>Transaction not found</p> }
  </>
);

export default Page;

