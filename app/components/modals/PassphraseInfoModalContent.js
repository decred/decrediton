import { FormattedMessage as T } from "react-intl";

export default () => (
  <Aux>
    <p className="info-modal-column">
      <span className="info-modal-row">
        <T id="passphrase.info.message" m="This passphrase ensures that no funds may be spent from this wallet without it.  It is used to encrypt your private keys associated with your addresses.  These private keys are required to sign transactions that spend from the addresses.  Make sure to use a high-security passphrase and keep this passphrase in a secure place.   With your wallet file and this private passphrase an attacker would have full control over any funds associated with this wallet." />
      </span>
    </p>
  </Aux>
);
