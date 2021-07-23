import styles from "./CreationWarning.module.css";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import { KeyBlueButton } from "buttons";

const CreationWarning = ({ onAcceptCreationWarning }) => {
  return (
    <>
      <Documentation name="LNWalletCreationWarning" />
      <KeyBlueButton onClick={onAcceptCreationWarning}>
        <T
          id="ln.createWalletWarning.okBtn"
          m="I understand and accept the risks"
        />
      </KeyBlueButton>
    </>
  );
};

export default CreationWarning;
