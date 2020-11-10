import { PassphraseModal } from "modals";
import { FormattedMessage as T } from "react-intl";

const TrezorPassphraseModal = (
  isGetStarted,
  device,
  onSubmitPassPhrase
) => {
  const onSubmit = (passPhrase) => {
    onSubmitPassPhrase(passPhrase);
  }

  const trezorLabel = device
    ? deviceLabel
    : "";

  const className = [
    "trezor-passphrase-modal",
    isGetStarted ? "get-started" : ""
  ].join(" ");

  return (
    <PassphraseModal
      show={true}
      modalTitle={
        <T id="trezor.passphraseModal.title" m="Enter Trezor Passphrase" />
      }
      modalClassName={className}
      modalDescription={
        <p>
          <T
            id="trezor.passphraseModal.description"
            m="Type the secret passphrase for the wallet stored in trezor {label}"
            values={{
              label: <span className="trezor-label">'{trezorLabel}'</span>
            }}
          />
        </p>
      }
      {...{ onCancelModal, onSubmit }}
    />
  );
}

export default TrezorPassphraseModal;
