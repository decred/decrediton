import { FormattedMessage as T } from "react-intl";
import { isArray } from "lodash";
import { Tooltip, classNames } from "pi-ui";
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
import { Documentation } from "shared";

const ExistingSeedForm = ({
  onChangeSeedWord,
  seedWords,
  handleOnPaste,
  hexSeed,
  seedType,
  pasteFromClipboard,
  handleToggle,
  showPasteWarning,
  showPasteError,
  showHexWarning,
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
        <div className={styles.backButtonWrapper}>
          <Tooltip content={<GoBackMsg />}>
            <BackButton onClick={sendBack} />
          </Tooltip>
        </div>
      )}
    </TitleWrapper>
    <Section className={classNames("flex-row", styles.seed)}>
      <Section className={styles.confirmSeedLabel}>
        <ConfirmSeedMsg />
      </Section>
      {seedType === WORDS && isArray(seedWords) ? (
        <SeedArea>
          {seedWords.map((seedWord, index) => (
            <SeedWord
              key={`seeditem-${index}`}
              seedWord={{ ...seedWord, index }}
              onPaste={handleOnPaste}
              onChangeSeedWord={onChangeSeedWord}
              onPasteFromClipboard={pasteFromClipboard}
              autoFocus={index === 0}
            />
          ))}
        </SeedArea>
      ) : (
        <SeedArea className={styles.hex}>
          <SeedHexEntry
            id="seedHexInput"
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
    {showHexWarning && (
      <SeedError>
        <T
          id="confirmSeed.errors.hexNot32Bytes"
          m="Error: seed is not 32 bytes, such comes from a non-supported software and may have unintended consequences."
        />
      </SeedError>
    )}
    {error && <SeedError>{error}</SeedError>}
    <div className={styles.passphraseContainer}>
      <Documentation name="PassphraseInfo" className={styles.passphraseInfo} />
      <CreatePassPhrase onChange={setPassPhrase} onSubmit={onCreateWallet} />
    </div>
    <ButtonsBar
      disabled={!isValid}
      message={<CreateWalletMsg />}
      onClick={onCreateWallet}
      onBackClick={sendBack}
    />
  </Container>
);

export default ExistingSeedForm;
