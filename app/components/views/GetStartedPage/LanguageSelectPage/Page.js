import { KeyBlueButton } from "buttons";
import "style/LanguageSelect.less";
import { LanguageSelect } from "inputs";
import { FormattedMessage as T } from "react-intl";
import cx from "classnames";

const LanguageSelectPage = ({ availableLanguages, selectedLang, onChangeSelectedLang, onSelectLang, isTestNet }) => {
  return (
    <div className={cx("page-body getstarted", isTestNet && "testnet-body")}>
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
