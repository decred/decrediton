import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import { SeedCopyConfirmModal } from "modals";
import { Documentation } from "shared";
import { GoBackMsg, CreateNewWalletTitle } from "../../../messages";
import {
  Container,
  TitleWrapper,
  SeedArea,
  SeedWord,
  ButtonsBar
} from "../../helpers";
import { BackButton } from "../../../helpers";
import styles from "./Form.module.css";

const CopySeedPage = ({
  showCopySeedConfirm,
  toggleCopySeed,
  onSubmitCopySeedConfirm,
  mnemonic,
  sendBack,
  sendContinue
}) => (
  <Container>
    <TitleWrapper title={<CreateNewWalletTitle />}>
      {sendBack && (
        <Tooltip content={<GoBackMsg />}>
          <BackButton onClick={sendBack} />
        </Tooltip>
      )}
    </TitleWrapper>
    <Documentation name="WalletCreationWarning" className={styles.warning} />
    <SeedArea>
      {mnemonic.split(" ").map((word, index) => (
        <SeedWord
          key={`seeditem-${index}`}
          seedWord={{ word, index, show: true }}
        />
      ))}
      <div className={styles.copy} onClick={() => toggleCopySeed(true)}>
        <T id="createWallet.copy" m="Copy seed words to clipboard" />
      </div>
    </SeedArea>
    <ButtonsBar
      message={<T id="createWallet.continueBtn" m="Continue" />}
      onBackClick={sendBack}
      onClick={sendContinue}
    />
    <SeedCopyConfirmModal
      show={showCopySeedConfirm}
      onSubmit={onSubmitCopySeedConfirm}
      onCancelModal={() => toggleCopySeed(false)}
    />
  </Container>
);

export default CopySeedPage;
