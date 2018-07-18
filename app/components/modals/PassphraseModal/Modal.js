import Modal from "../Modal";
import ButtonsToolbar from "./ButtonsToolbar";
import PassphraseInputRow from "./PassphraseInputRow";
import { FormattedMessage as T } from "react-intl";
import Keyboard from 'react-simple-keyboard';

const propTypes = {
  modalTitle: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onCancelModal: PropTypes.func.isRequired,
  description: PropTypes.object
};

function showKeyboard() {
  var keyboardBox = document.getElementById("keyboardPopup");
  var keys = document.getElementsByClassName("simple-keyboard");
  if (keyboardBox.style.display == "block" || keys[0].style.display == "block") {
    keyboardBox.style.display = "none";
    keys[0].style.display = "none";
  }

  else { 
    keyboardBox.style.display = "block";
    keys[0].style.display = "block";
  }

}

var onChange = (input) => {
  console.log("Input changed", input);
  var x = document.getElementById("password-box").childNodes[0].childNodes[1].childNodes[0].childNodes[0];
  x.value = String(input);
}

const StandardPassphraseModal = (props) => {
  const {
    show,
    modalDescription,
    children,
    prependPassphraseRow,
    onCancelModal,
  } = props;

  const inputRow =
    <PassphraseInputRow
      {...{
        ...props,
        autoFocusPassword: prependPassphraseRow || !children
      }}
    />;

  return (
    <div>
      <Modal className="passphrase-modal" {...{ show, onCancelModal }}>
        <div className="passphrase-modal-header">
          <div className="passphrase-modal-header-title">
            <T id="passphraseModal.confirmationRequired" m="Confirmation Required" />
          </div>
          <div>
            <br />
            <input type="checkbox" style={{ display: "inline" }} onClick={() => { showKeyboard(); }} />
            <span style={{ fontFamily: "Arial", verticalAlign: "text-top" }}>This is an untrusted device</span><br />
          </div>
          <div className="passphrase-modal-header-description">
            {modalDescription}
          </div>
        </div>
        <div className="passphrase-modal-content" id="password-box">
          {prependPassphraseRow ? inputRow : null}
          {children}
          {prependPassphraseRow ? null : inputRow}
        </div>
        <ButtonsToolbar {...props} />
      </Modal>

      <div className="passphrase-modal" style={{
        display: "none", position: "absolute", zIndex: "22", bottom: "20px", width: "-webkit-fill-available"
      }}>
          <Modal  {...{ show, onCancelModal }}>
            <div id="keyboardPopup" style={{ display: "none", fontFamily: "Arial" }} className="passphrase-modal">
              Enter passphase to purchase tickets:<br /><br />
            </div>
            <Keyboard style={{ display: "none" }}
              onChange={input => onChange(input)}
            />
        </Modal>

      </div>
    </div>
  );
};

StandardPassphraseModal.propTypes = propTypes;

export default StandardPassphraseModal;
