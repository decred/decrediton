import { FormattedMessage as T } from "react-intl";
import { Tooltip, Icon, useTheme, getThemeProperty } from "pi-ui";
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
}) => {
  const { theme } = useTheme();
  const iconColor = getThemeProperty(theme, "accent-blue");
  return (
    <Container>
      <TitleWrapper title={<CreateNewWalletTitle />}>
        {sendBack && (
          <Tooltip content={<GoBackMsg />}>
            <BackButton onClick={sendBack} />
          </Tooltip>
        )}
      </TitleWrapper>
      <Documentation name="WalletCreationWarning" className={styles.warning} />
      <SeedArea className={styles.seedArea}>
        {mnemonic.split(" ").map((word, index) => (
          <SeedWord
            key={`seeditem-${index}`}
            seedWord={{ word, index, show: true }}
          />
        ))}
        <div className={styles.copy} onClick={() => toggleCopySeed(true)}>
          <Icon type="copyToClipboard" backgroundColor={iconColor} />
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
};

export default CopySeedPage;
