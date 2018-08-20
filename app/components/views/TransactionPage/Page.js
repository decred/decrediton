import TxDetails from "../TxDetails";

const Page = ({ transactionDetails, decodedTransaction, tsDate }) => (
  <Aux>
    { transactionDetails ?
      <TxDetails tx={transactionDetails} {...{ decodedTransaction, tsDate }}/> :
      <p>Transaction not found</p> }
  </Aux>
);

export default Page;

