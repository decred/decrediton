import TxDetails from "../TxDetails";

const Page = ({ transactionDetails, routes, router }) => (
  <Aux>
    { transactionDetails ?
    <TxDetails tx={transactionDetails} {...{ routes, router }}/> :
    <p>Transaction not found</p> }
  </Aux>
);

export default Page;
