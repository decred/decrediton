import "style/CreateWalletForm.less";
import { InfoDocFieldModalButton } from "buttons";
import SingleSeedWordEntry from "../SingleSeedWordEntry";
import WalletHeader from "../createWalletHeader";
import { ConfirmSeedMsg } from "../../messages";

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
          const className = "seedWord " + (!seedWord.show ? seedWord.match ? "match" : "no-match" : "");
          return ( seedWord.show ?
            <div key={seedWord.index} className="seedWord">{seedWord.word}</div> :
            <SingleSeedWordEntry
              className={className}
              disabled={seedWord.show}
              onChange={onChangeSeedWord}
              seedWord={seedWord}
              value={{ name: seedWord.word }}
              key={seedWord.index}
            />);
        })}
      </div>
    </div>
  </>
);

export default ConfirmSeedForm;
