import TxDetails from "../TxDetails";

const Page = ({ transactionDetails, decodedTransaction, tsDate, modal }) => (
  <>
    { transactionDetails ?
      <TxDetails tx={transactionDetails} {...{ decodedTransaction, tsDate, modal }}/> :
      <p>Transaction not found</p> }
  </>
);

export default Page;

