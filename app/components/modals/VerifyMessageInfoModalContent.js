import { FormattedMessage as T } from "react-intl";

export default () => (
  <Aux>
    <p className="info-modal-column">
      <span className="info-modal-row">
        <T id="verify.info.message" m="After you or your counterparty has generated a signature, you can use this form to verify the validity of the signature.  Once you have entered the address, the message and the corresponding signature, you will see VALID if the signature appropriately matches the address and message, otherwise INVALID." />
      </span>
    </p>
  </Aux>
);
