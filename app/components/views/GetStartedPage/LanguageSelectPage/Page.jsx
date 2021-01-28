import { KeyBlueButton } from "buttons";
import { LanguageSelectInput } from "inputs";
import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import styles from "../GetStarted.module.css";

const LanguageSelectPage = ({
  availableLanguages,
  selectedLang,
  onChangeSelectedLang,
  onSelectLang,
  isTestNet
}) => (
  <div
    data-testid="getstarted-pagebody"
    className={classNames(
      styles.pageBody,
      styles.getstarted,
      isTestNet && styles.testnetBody
    )}>
    <div className={styles.getstartedNew}>
      <div className={styles.title}>
        <T id="selectLang.title" m={"Welcome to Decrediton Wallet"} />
      </div>
      <div className={styles.titleSub}>
        <T id="selectLang.titleSub" m={"Choose your language"} />
      </div>
      <div className={styles.toolbar}>
        <LanguageSelectInput
          value={selectedLang}
          onChange={onChangeSelectedLang}
          valueKey="key"
          labelKey="description"
          options={availableLanguages}
        />
        <KeyBlueButton className={styles.button} onClick={onSelectLang}>
          <T id="selectLang.continueBtn" m={"Continue"} />
        </KeyBlueButton>
      </div>
    </div>
  </div>
);

export default LanguageSelectPage;
