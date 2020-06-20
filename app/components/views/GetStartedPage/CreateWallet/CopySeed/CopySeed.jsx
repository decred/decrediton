import Form from "./Form";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as cli from "actions/ClientActions";

const CopySeed = ({ mnemonic, sendContinue, sendBack }) => {
  const [showCopySeedConfirm, setShowCopySeed] = useState(false);
  const dispatch = useDispatch();
  const copySeedToClipboard = (mnemonic) =>
    dispatch(cli.copySeedToClipboard(mnemonic));

  const onSubmitCopySeedConfirm = () => {
    setShowCopySeed(false);
    copySeedToClipboard(mnemonic);
  };

  return (
    <Form
      {...{
        mnemonic,
        showCopySeedConfirm,
        toggleCopySeed: setShowCopySeed,
        onSubmitCopySeedConfirm,
        sendContinue,
        sendBack
      }}
    />
  );
};

export default CopySeed;
