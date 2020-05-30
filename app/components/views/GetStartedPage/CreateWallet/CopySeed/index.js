import CopySeed from "./Page";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as cli from "actions/ClientActions";

export default function ({ mnemonic, sendContinue, sendBack }) {
  const [showCopySeedConfirm, setShowCopySeed] = useState(false);
  const dispatch = useDispatch();
  const copySeedToClipboard = (mnemonic) => dispatch(cli.copySeedToClipboard(mnemonic));

  const onSubmitCopySeedConfirm = () => {
    console.log(mnemonic);
    setShowCopySeed(false);
    copySeedToClipboard(mnemonic);
  };

  return (
    <CopySeed
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
}
