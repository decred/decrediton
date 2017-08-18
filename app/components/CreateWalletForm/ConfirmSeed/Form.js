import React from "react";
import SeedEntry from "./SeedEntry";
import "../../../style/CreateWalletForm.less";

const ConfirmSeedForm = ({
  remainingSeedWords,
  seedError,
  setSeedWords,
  isMatch,
  isEmpty
}) => (
  <div className="confirm-seed">
    <div className="create-wallet-label">
      <div className="confirm-seed-label-text">Confirm Seed:</div>
      <div className="confirm-seed-label-remaining-words">{remainingSeedWords} words remaining</div>
    </div>
    <div className="create-wallet-field">
      <div className="input-form">
        <form className="input-form-confirm-seed">
          <SeedEntry label="Seed Entry" onChange={setSeedWords}/>
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

export default ConfirmSeedForm;
