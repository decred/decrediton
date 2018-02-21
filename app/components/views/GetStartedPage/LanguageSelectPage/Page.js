import { KeyBlueButton } from "buttons";
import "style/LanguageSelect.less";
import { LanguageSelect } from "inputs";
import { FormattedMessage as T } from "react-intl";

const LanguageSelectPage = ({ availableLanguages, selectedLang, onChangeSelectedLang, onSelectLang }) => {
  return (
    <div className="page-body getstarted">
      <div className="getstarted-logo">
      </div>
      <div className="getstarted-new">
        <div className="language-select-title">
          <T id="selectLang.title" m={"Welcome to Decrediton Wallet"}/>
        </div>
        <div className="language-select-title-sub">
          <T id="selectLang.titleSub" m={"Choose your language"}/>
        </div>
        <div className="language-select-toolbar">
          <LanguageSelect
            className="language-select-input"
            value={selectedLang}
            onChange={onChangeSelectedLang}
            valueKey="key" labelKey="description"
            options={availableLanguages}
          />
          <KeyBlueButton className="language-select-button" onClick={onSelectLang} >
            <T id="selectLang.continueBtn" m={"Continue"}/>
          </KeyBlueButton>
        </div>
      </div>
    </div>
  );
};
export default LanguageSelectPage;
