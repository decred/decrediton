import React from "react";
import SeedEntry from "./SeedEntry";
import { FormattedMessage as T } from "react-intl";
import "style/CreateWalletForm.less";
import InfoModalButton from "InfoModalButton";
import { SeedInfoModalContent } from "modals";

class ConfirmSeedForm extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      showPasteWarning : false
    };
  }

  handleOnPaste = (e) => {
    e.preventDefault();
    this.setState({
      showPasteWarning : true
    });
  }

  render(){
    const { remainingSeedWords, setSeedWords, isMatch, seedError, isEmpty } = this.props;
    return (
      <div className="confirm-seed">
        <div className="create-wallet-label">
          <div className="confirm-seed-label-text">
            <T id="confirmSeed.label" m="Confirm Seed" />:
            <InfoModalButton
              modalTitle={<h1><T id="confirmSeed.seedInformation" m="Seed information" /></h1>}
              modalContent={<SeedInfoModalContent />}
            />
          </div>
          <div className="confirm-seed-label-remaining-words">
            <T id="confirmSeed.wordsRemaining" m="{remainingSeedWords, plural, one {one word remaining} other {# words remaining} }"
              values={{remainingSeedWords: remainingSeedWords}} />
          </div>
        </div>
        <div className="create-wallet-field">
          <div className="input-form">
            {!this.state.showPasteWarning ? null : <div className="orange-warning">
              <T id="confirmSeed.errors.noPaste" m="*You should not paste your Seeds. Please type it" />
            </div>}
            <form className="input-form-confirm-seed">
              <SeedEntry label="Seed Entry" onChange={setSeedWords} onPaste={this.handleOnPaste} />
            </form>
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
