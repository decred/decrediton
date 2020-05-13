import LanguageSelectPage from "./Page";
import { daemonStartup } from "connectors";

@autobind
class LanguageSelect extends React.Component {
  constructor(props) {
    super(props);
    const { availableLanguages, defaultLocale } = this.props;
    this.state = {
      selectedLang:
        availableLanguages.find((v) => v.language === defaultLocale) ||
        availableLanguages[0]
    };
  }

  render() {
    const { selectedLang } = this.state;
    const { onChangeSelectedLang, onSelectLang } = this;
    const { availableLanguages, isTestNet } = this.props;
    return (
      <LanguageSelectPage
        {...{
          selectedLang,
          availableLanguages,
          onChangeSelectedLang,
          onSelectLang,
          isTestNet
        }}
      />
    );
  }
  onChangeSelectedLang(newLang) {
    this.setState({ selectedLang: newLang });
  }
  onSelectLang() {
    this.props.onSelectLanguage(this.state.selectedLang);
  }
}

export default daemonStartup(LanguageSelect);
