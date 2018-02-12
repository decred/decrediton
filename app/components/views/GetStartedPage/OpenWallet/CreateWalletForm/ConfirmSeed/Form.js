import { FormattedMessage as T } from "react-intl";
import "style/CreateWalletForm.less";
import { InfoModalButton } from "buttons";
import { TextInput } from "inputs";
import { SeedInfoModalContent } from "modals";

class ConfirmSeedForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {

    };
  }

  handleOnPaste = (e) => {
    e.preventDefault();
    this.setState({
      showPasteWarning : true
    });
  }

  mountSeedErrors = () => {
    const errors = [];
    if(this.props.seedError) {
      errors.push(
        <div key={this.props.seedError}>
          {this.props.seedError}
        </div>
      );
    }
    return errors;
  }

  render(){
    const { seedWords, onChangeSeedWord } = this.props;
    return (
      <div className="confirm-seed">
        <div className="create-wallet-header">
          <div className="create-wallet-label">
            <div className="confirm-seed-label-text">
              <T id="confirmSeed.label" m="Confirm Seed" />:
              <InfoModalButton
                modalTitle={<h1><T id="confirmSeed.seedInformation" m="Seed information" /></h1>    }
                modalContent={<SeedInfoModalContent />}
              />
            </div>
          </div>
        </div>
        <div className="create-wallet-field">
          <div className="input-form">
            {!this.state.showPasteWarning ? null : <div className="orange-warning">
              <T id="confirmSeed.errors.noPaste" m="*You should not paste your Seeds. Please type it" />}
            </div>}
            {seedWords.map((seedWord) => {
              return <TextInput disabled={seedWord.show} onChange={(e) => onChangeSeedWord(seedWord,e.target.value)} value={seedWord.word} key={seedWord.index} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmSeedForm;
