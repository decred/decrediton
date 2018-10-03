import "style/CreateWalletForm.less";
import { InfoDocFieldModalButton } from "buttons";
import SingleSeedWordEntry from "../SingleSeedWordEntry";
import { CreateWalletTitleMsg, ConfirmSeedMsg } from "../../../messages";

export const ConfirmSeedForm = ({ seedWords, onChangeSeedWord }) =>
  (
    <Aux>
      <div className="content-title">
        <CreateWalletTitleMsg />
      </div>
      <div className="confirm-seed-row seed">
        <div className="confirm-seed-label-text seed">
          <div className="info-label">
            <ConfirmSeedMsg />
          </div>
          <InfoDocFieldModalButton document="SeedInfo" />
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
    </Aux>
  );

export default ConfirmSeedForm;
