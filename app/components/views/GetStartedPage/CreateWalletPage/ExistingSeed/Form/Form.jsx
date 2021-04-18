import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import { SeedHexEntry } from "inputs";
import { TextToggle } from "buttons";
import { ConfirmSeedMsg, GoBackMsg, CreateWalletMsg } from "../../../messages";
import { WORDS, HEX } from "constants";
import { CreatePassPhrase } from "shared";
import {
  Container,
  TitleWrapper,
  Section,
  SeedArea,
  SeedWord,
  SeedError,
  ButtonsBar
} from "../../helpers";
import { BackButton } from "../../../helpers";
import styles from "./Form.module.css";

const ExistingSeedForm = ({
  onChangeSeedWord,
  seedWords,
  handleOnPaste,
  hexSeed,
  isCreatingWallet,
  seedType,
  pasteFromClipboard,
  handleToggle,
  showPasteWarning,
  showPasteError,
  isValid,
  onCreateWallet,
  sendBack,
  setPassPhrase,
  error
}) => (
  <Container>
    <TitleWrapper
      title={<T id="createWallet.restore.title" m="Restore existing wallet" />}>
      {/* XXX: Use pi-iu's toggle */}
      <TextToggle
        activeButton="left"
        leftText={WORDS}
        rightText={HEX}
        toggleAction={handleToggle}
      />
      {sendBack && (
        <Tooltip content={<GoBackMsg />}>
          <BackButton onClick={sendBack} />
        </Tooltip>
      )}
    </TitleWrapper>
    <Section className="flex-row">
      <Section className={styles.confirmSeedLabel}>
        <ConfirmSeedMsg />
      </Section>
      {seedType === WORDS && Array.isArray(seedWords) ? (
        <SeedArea>
          {seedWords.map((seedWord, index) => (
            <SeedWord
              seedWord={{ ...seedWord, index }}
              onPaste={handleOnPaste}
              onChangeSeedWord={onChangeSeedWord}
              onPasteFromClipboard={pasteFromClipboard}
            />
          ))}
        </SeedArea>
      ) : (
        <SeedArea className={styles.hex}>
          <SeedHexEntry
            onChange={(e) => onChangeSeedWord(e.target.value)}
            seed={hexSeed}
          />
        </SeedArea>
      )}
    </Section>
    {showPasteError && (
      <SeedError>
        <T
          id="confirmSeed.warnings.pasteExistingError"
          m="* Please paste a valid 33 word seed."
        />
      </SeedError>
    )}
    {showPasteWarning && (
      <SeedError>
        <T
          id="confirmSeed.warnings.pasteExistingSeed"
          m="*Please make sure you also have a physical, written down copy of your seed."
        />
      </SeedError>
    )}
    {error && <SeedError>{error}</SeedError>}
    <CreatePassPhrase onChange={setPassPhrase} onSubmit={onCreateWallet} />
    <ButtonsBar
      disabled={!isValid}
      message={<CreateWalletMsg />}
      loading={isCreatingWallet}
      onClick={onCreateWallet}
      onBackClick={sendBack}
    />
  </Container>
);

export default ExistingSeedForm;
