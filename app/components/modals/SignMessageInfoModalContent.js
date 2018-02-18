import { FormattedMessage as T } from "react-intl";

export default () => (
  <Aux>
    <p className="info-modal-column">
      <span className="info-modal-row">
        <T id="sign.info.message" m="Signing a message with an address' private key allows you to prove that you are the owner of a given address to a possible counterparty.  For instance, let's say you sent 100 Hx to a merchant and you have yet to receive your merchandise.  You contact the merchant and explain the situation, but need a way to prove you are, in fact, the owner of the address that the funds were sent from.  To do this you can generate a signature based on a message only known to you and your counterparty and the private key associated with the address.  Upon receipt, the counterparty may use the Verify Message form to ensure the signature is VALID." />
      </span>
    </p>
  </Aux>
);
