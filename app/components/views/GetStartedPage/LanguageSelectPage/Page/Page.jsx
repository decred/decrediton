import { KeyBlueButton } from "buttons";
import { LanguageSelectInput } from "inputs";
import { PageBody } from "layout";
import { FormattedMessage as T } from "react-intl";
import styles from "./Page.module.css";
import { Content, Title, SubTitle } from "../../helpers";

const LanguageSelectPage = ({
  availableLanguages,
  selectedLang,
  onChangeSelectedLang,
  onSelectLang,
  isTestNet
}) => (
  <PageBody data-testid="getstarted-pagebody" getStarted isTestNet={isTestNet}>
    <Content>
      <Title>
        <T id="selectLang.title" m="Welcome to Decrediton Wallet" />
      </Title>
      <SubTitle>
        <T id="selectLang.titleSub" m="Choose your language" />
      </SubTitle>
      <div className={styles.toolbar}>
        <LanguageSelectInput
          value={selectedLang.key}
          onChange={onChangeSelectedLang}
          valueKey="key"
          labelKey="description"
          options={availableLanguages}
        />
        <KeyBlueButton className={styles.button} onClick={onSelectLang}>
          <T id="selectLang.continueBtn" m="Continue" />
        </KeyBlueButton>
      </div>
    </Content>
  </PageBody>
);

export default LanguageSelectPage;
