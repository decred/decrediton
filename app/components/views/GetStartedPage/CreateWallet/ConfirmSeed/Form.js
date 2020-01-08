import "style/CreateWalletForm.less";
import { InfoDocFieldModalButton, KeyBlueButton, InvisibleButton } from "buttons";
import SingleSeedWordEntry from "../SingleSeedWordEntry";
import { ConfirmSeedMsg, BackBtnMsg } from "../../messages";
import { FormattedMessage as T } from "react-intl";
import { Tooltip, CreatePassPhrase } from "shared";

export const ConfirmSeedForm = ({ seedWords, onChangeSeedWord, isValid, onCreateWallet, sendBack, setPassPhrase }) => (
  <>
    <div className="content-title-wrapper is-row">
      <div className="content-title">
        <T id="createWallet.title" m={"Create a new wallet"}/>
      </div>
      {sendBack && <Tooltip text={<T id="createWallet.goBack" m="Go back" />}><div className="go-back-screen-button" onClick={ sendBack } /></Tooltip>}
    </div>
    <div className="seed is-row">
      <div className="is-row confirm-seed-label-text seed">
        <InfoDocFieldModalButton document="SeedInfo" />
        <div className="info-label">
          <ConfirmSeedMsg />
        </div>
      </div>
      <div className="seedArea">
        {seedWords.map((seedWord) => {
          let className = "seedWord ";
          if (seedWord.show){
            className += "filled";
          } else if (seedWord.word != ""){
            className += seedWord.match ? "match" : "no-match";
          } else {
            className += "empty";
          }
          return (
            <div key={`seeditem-${seedWord.index}`} className={className}>
              <span className="number">{seedWord.index + 1}.</span>
              <span className="word">
                { seedWord.show ? seedWord.word :
                  <SingleSeedWordEntry
                    disabled={seedWord.show}
                    onChange={onChangeSeedWord}
                    seedWord={seedWord}
                    className="Select-menu-with-arrow"
                    value={{ name: seedWord.word }}
                  />
                }
              </span>
            </div>
          );})}
      </div>
    </div>
    <CreatePassPhrase onChange={setPassPhrase} onSubmit={onCreateWallet} />
    <div className="create-wallet-button-container">
      <KeyBlueButton
        className="wallet-key-blue-button"
        disabled={!isValid}
        // loading={isCreatingWallet}
        onClick={onCreateWallet}
      >
        <T id="createWallet.createWalletBtn" m="Create Wallet" />
      </KeyBlueButton>
      <InvisibleButton className="go-back-button" onClick={ sendBack } >
        <BackBtnMsg />
      </InvisibleButton>
    </div>
  </>
);

export default ConfirmSeedForm;
