import TxDetails from "../TxDetails";

const Page = ({ transactionDetails, decodedTransaction }) => (
  <Aux>
    { transactionDetails ?
      <TxDetails tx={transactionDetails} {...{ decodedTransaction }}/> :
      <p>Transaction not found</p> }
  </Aux>
);

export default Page;
