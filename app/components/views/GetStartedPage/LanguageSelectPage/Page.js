import { KeyBlueButton } from "buttons";
import "style/LanguageSelect.less";
import { SettingsInput } from "inputs";
import { FormattedMessage as T } from "react-intl";

const LanguageSelectPage = ({availableLanguages, selectedLang, onChangeSelectedLang, onSelectLang}) => {
  return (
    <div className="language-select">
      <div className="logo">
      </div>
      <div className="language-select-title">
        <T id="selectLang.title" m={"Welcome to Decrediton Wallet"}/>
      </div>
      <div className="language-select-title-sub">
        <T id="selectLang.titleSub" m={"Choose your language"}/>
      </div>
      <SettingsInput
        className="settings-input"
        value={selectedLang}
        onChange={onChangeSelectedLang}
        valueKey="key" labelKey="description"
        options={availableLanguages}
      />
      <KeyBlueButton className="select-language-button" onClick={onSelectLang} >
        <T id="selectLang.continueBtn" m={"Continue"}/>
      </KeyBlueButton>
    </div>
  );
};
export default LanguageSelectPage;
