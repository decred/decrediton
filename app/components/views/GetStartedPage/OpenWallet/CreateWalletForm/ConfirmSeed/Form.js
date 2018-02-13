import { FormattedMessage as T } from "react-intl";
import "style/CreateWalletForm.less";
import { InfoModalButton } from "buttons";
import SingleSeedWordEntry from "./SingleSeedWordEntry";
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
    console.log("rerender", this.props.seedWords);
    const { seedWords, seedError, onChangeSeedWord } = this.props;
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
            <div className="input-form-error">
              {seedError && seedError}
            </div>
            {seedWords.map((seedWord) => {
              const className = "confirm-seed-word " + (!seedWord.show ? seedWord.match ? "match" : "no-match" : "");
              return (
                <SingleSeedWordEntry
                  className={className}
                  disabled={seedWord.show}
                  onChange={onChangeSeedWord}
                  seedWord={seedWord}
                  value={{name: seedWord.word}}
                  key={seedWord.index}
                />);
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmSeedForm;
