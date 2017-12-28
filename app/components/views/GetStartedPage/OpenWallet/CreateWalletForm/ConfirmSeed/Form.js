import SeedEntry from "./SeedEntry";
import { TextToggle } from "buttons";
import { FormattedMessage as T } from "react-intl";
import "style/CreateWalletForm.less";
import { InfoModalButton } from "buttons";
import { SeedInfoModalContent } from "modals";
import { SEED_LENGTH } from "wallet/seed";

const getRemaining = (seedWords, seedType) =>
  (seedType === "words" ? SEED_LENGTH.WORDS - (seedWords.length ? seedWords.split(" ") : []).length
  : seedWords.length);

class ConfirmSeedForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      showPasteWarning : false,
      seedType: "words",
    };
  }

  handleOnPaste = (e) => {
    e.preventDefault();
    this.setState({
      showPasteWarning : true
    });
  }

  handleToggle = (side) => {
    this.setState({ seedType: side === "left" ? "words" : "hex"});
  }

  render(){
    const { isMatch, seedError, isEmpty, seedWords, setSeedWords, createWalletExisting } = this.props;
    const { seedType } = this.state;
    const remaining = getRemaining(seedWords, seedType);
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
            <div className="confirm-seed-label-remaining-words">
              {seedType === "words" ?
                <T id="confirmSeed.wordsRemaining" m="{remaining, plural, one {one word remaining} other {# words remaining} }"
                  values={{remaining: remaining}} />
                :
                <T id="confirmSeed.hexSymbolsRemaining" m="{remaining, plural, one {one hex symbol: your key must have at least 32 symbols and 128 max} other {# hex symbols: your key must have at least 32 symbols and 128 max } }"
                  values={{remaining: remaining}} />
              }
            </div>
          </div>
          {createWalletExisting && <div className="seed-type-label">
            <T id="seedType.label" m="Seed type" />
            <TextToggle
              activeButton={"left"}
              leftText={"words"}
              rightText={"hex"}
              toggleAction={this.handleToggle}
            />
          </div>
          }
        </div>
        <div className="create-wallet-field">
          <div className="input-form">
            {!this.state.showPasteWarning ? null : <div className="orange-warning">
              <T id="confirmSeed.errors.noPaste" m="*You should not paste your Seeds. Please type it" />
            </div>}
            <form className="input-form-confirm-seed">
              <SeedEntry label="Seed Entry" seedType={seedType} onChange={setSeedWords} onPaste={this.handleOnPaste} />
            </form>
            }
          </div>
          <div className="input-form-error">
            {seedError
              ? seedError
              : isMatch || isEmpty
                ? null
                : <T id="confirmSeed.errors.seedsDontMatch" m="*Seeds do not match" /> }
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmSeedForm;
