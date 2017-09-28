import React from "react";
import SeedEntry from "./SeedEntry";
import "../../../style/CreateWalletForm.less";

class ConfirmSeedForm extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      showPasteWarning : false
    }
  }

  handleCtrlVClick = () => {
    this.setState({
      showPasteWarning : true
    })
  }

  render(){
    const { remainingSeedWords, setSeedWords, isMatch, seedError, isEmpty } = this.props;
    const { showPasteWarning } = this.state
    return (
      <div className="confirm-seed">
          <div className="create-wallet-label">
            <div className="confirm-seed-label-text">Confirm Seed:</div>
            <div className="confirm-seed-label-remaining-words">{remainingSeedWords} words remaining</div>
          </div>
          <div className="create-wallet-field">
            <div className="input-form">
              <div className="orange-warning">{!this.state.showPasteWarning
                ? ''
                  : "*You should not paste your Seeds. Please type it"}</div>
              <form className="input-form-confirm-seed">
                <SeedEntry label="Seed Entry" onChange={setSeedWords} onCtrlVClick={this.handleCtrlVClick} />
              </form>
            </div>
            <div className="input-form-error">
              {seedError
                ? seedError
                : isMatch || isEmpty
                  ? null
                  : "*Seeds do not match"}
            </div>
          </div>
        </div>
    );
  }
}

export default ConfirmSeedForm;
