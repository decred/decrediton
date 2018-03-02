import { FormattedMessage as T } from "react-intl";
import "style/CreateWalletForm.less";
import { InfoModalButton } from "buttons";
import SingleSeedWordEntry from "../SingleSeedWordEntry";
import { SeedInfoModalContent } from "modals";

export const ConfirmSeedForm = ({ seedWords, onChangeSeedWord }) =>
  (
    <Aux>
      <div className="content-title">
        <T id="createWallet.title" m={"Create a new wallet"}/>
      </div>
      <div className="confirm-seed-row seed">
        <div className="confirm-seed-label-text seed">
          <InfoModalButton
            modalTitle={<h1><T id="confirmSeed.seedInformation" m="Seed information" /></h1>    }
            modalContent={<SeedInfoModalContent />}
          />
          <T id="confirmSeed.label" m="Confirm Seed" />
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
