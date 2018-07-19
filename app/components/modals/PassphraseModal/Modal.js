import Modal from "../Modal";
import ButtonsToolbar from "./ButtonsToolbar";
import PassphraseInputRow from "./PassphraseInputRow";
import { FormattedMessage as T } from "react-intl";
import Keyboard from "react-simple-keyboard";


const propTypes = {
  modalTitle: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onCancelModal: PropTypes.func.isRequired,
  description: PropTypes.object
};


function showKeyboard() {

  // Do not show on Update Private Password from settings
  try {
    if (document.getElementById("password-box").childNodes[2].childNodes[0].childNodes[0].innerHTML == "Confirm:") {
      return null;
    }
  } catch (e) {
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


}

// Trigger React onchange to save update to React state on simple keyboard input
var event = new Event("input", { bubbles: true });

var onChange = (input) => {
  //console.log("Input changed", input);
  var x = document.getElementById("password-box").childNodes[0].childNodes[1].childNodes[0].childNodes[0];

  // Second element on New Account Name
  if (document.getElementById("password-box").childNodes[0].childNodes[0].childNodes[0].innerHTML == "New Account Name") {
    x = document.getElementById("password-box").childNodes[1].childNodes[1].childNodes[0].childNodes[0];
  }

  // Update UI
  x.value = String(input);

  // Trigger onchange to save update to react state
  var tracker = x._valueTracker;
  if (tracker) {
    tracker.setValue("'" + x.value + "'");
  }
  x.dispatchEvent(event);
};

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
            Enter passphase:<br /><br />
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
