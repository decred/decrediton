import "style/CreateWalletForm.less";
import { InfoDocFieldModalButton } from "buttons";
import SingleSeedWordEntry from "../SingleSeedWordEntry";
import WalletHeader from "../createWalletHeader";
import { ConfirmSeedMsg } from "../../../messages";

export const ConfirmSeedForm = ({ seedWords, onChangeSeedWord, onReturnToNewSeed }) => (
  <>
    <WalletHeader {...{ onBack: onReturnToNewSeed }} />
    <div className="seed is-row">
      <div className="is-row confirm-seed-label-text seed">
        <InfoDocFieldModalButton document="SeedInfo" />
        <div className="info-label">
          <ConfirmSeedMsg />
        </div>
      </div>
      <div className="seedArea">
        {seedWords.map((seedWord) => {

          var className = "seedWord ";
          if (seedWord.show){
            className += "filled";
          } else if (seedWord.word != ""){
            className += seedWord.match ? "match" : "no-match";
          } else {
            className += "empty";
          }

          return <>
            <div key={seedWord.index} className={className}>
              <span className="number">{seedWord.index + 1}.</span>
              <span className="word">
                { seedWord.show ? seedWord.word :
                  <SingleSeedWordEntry
                    disabled={seedWord.show}
                    onChange={onChangeSeedWord}
                    seedWord={seedWord}
                    value={{ name: seedWord.word }}
                    key={seedWord.index}
                  />
                }
              </span>
            </div>
          </>;
        })}
      </div>
    </div>
  </>
);

export default ConfirmSeedForm;
