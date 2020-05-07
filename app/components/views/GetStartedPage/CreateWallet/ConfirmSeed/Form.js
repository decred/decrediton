import "style/CreateWalletForm.less";
import {
  InfoDocFieldModalButton,
  KeyBlueButton,
  InvisibleButton
} from "buttons";
import SingleSeedWordEntry from "../SingleSeedWordEntry";
import {
  ConfirmSeedMsg,
  BackBtnMsg,
  CreateWalletMsg,
  GoBackMsg,
  CreateNewWalletTitle
} from "../../messages";
import { Tooltip, CreatePassPhrase } from "shared";

export const ConfirmSeedForm = ({
  seedWords,
  onChangeSeedWord,
  isValid,
  onCreateWallet,
  sendBack,
  setPassPhrase,
  isCreatingWallet
}) => (
  <>
    <div className="content-title-wrapper is-row">
      <div className="content-title">
        <CreateNewWalletTitle />
      </div>
      {sendBack && (
        <Tooltip text={<GoBackMsg />}>
          <div className="go-back-screen-button" onClick={sendBack} />
        </Tooltip>
      )}
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
          if (seedWord.show) {
            className += "filled";
          } else if (seedWord.word != "") {
            className += seedWord.match ? "match" : "no-match";
          } else {
            className += "empty";
          }
          return (
            <div key={`seeditem-${seedWord.index}`} className={className}>
              <span className="number">{seedWord.index + 1}.</span>
              <span className="word">
                {seedWord.show ? (
                  seedWord.word
                ) : (
                  <SingleSeedWordEntry
                    disabled={seedWord.show}
                    onChange={onChangeSeedWord}
                    seedWord={seedWord}
                    className="Select-menu-with-arrow"
                    value={{ name: seedWord.word }}
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
    <CreatePassPhrase onChange={setPassPhrase} onSubmit={onCreateWallet} />
    <div className="create-wallet-button-container">
      <KeyBlueButton
        className="wallet-key-blue-button"
        disabled={!isValid}
        loading={isCreatingWallet}
        onClick={onCreateWallet}>
        <CreateWalletMsg />
      </KeyBlueButton>
      <InvisibleButton className="go-back-button" onClick={sendBack}>
        <BackBtnMsg />
      </InvisibleButton>
    </div>
  </>
);

export default ConfirmSeedForm;
