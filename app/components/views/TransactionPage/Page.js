import TxDetails from "../TxDetails";

const Page = ({ transactionDetails, decodedTransaction, routes, router }) => (
  <Aux>
    { transactionDetails ?
      <TxDetails tx={transactionDetails} {...{ decodedTransaction, routes, router }}/> :
      <p>Transaction not found</p> }
  </Aux>
);

export default Page;
