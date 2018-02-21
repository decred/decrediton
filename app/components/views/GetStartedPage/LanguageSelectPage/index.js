import LanguageSelectPage from "./Page";
import { walletStartup } from "connectors";

@autobind
class LanguageSelect extends React.Component{
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      selectedLang: this.props.defaultLocale
    };
  }

  render() {
    const { selectedLang } = this.state;
    const { onChangeSelectedLang, onSelectLang } = this;
    const { availableLanguages } = this.props;
    return (
      <LanguageSelectPage
        {...{
          selectedLang,
          availableLanguages,
          onChangeSelectedLang,
          onSelectLang
        }
        }/>);
  }
  onChangeSelectedLang(newLang) {
    this.setState({ selectedLang: newLang });
  }
  onSelectLang() {
    this.props.onSelectLanguage(this.state.selectedLang);
  }

}

export default walletStartup(LanguageSelect);
