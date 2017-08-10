import React from "react";
import SeedEntry from "./SeedEntry";
import styles from "../styles";

const ConfirmSeedForm = ({
  remainingSeedWords,
  seedError,
  setSeedWords,
  isMatch,
  isEmpty
}) => (
  <div style={styles.contentNewSeedConfirmSeed}>
    <div style={styles.contentConfirmWalletCreateInputLeft}>
      <span style={{float:"left"}}>Confirm Seed:&nbsp;</span>
      <span style={{float:"left",fontSize:"13px",color:"white"}}> Seed words remaining: {remainingSeedWords} </span>
    </div>
    <div style={styles.contentConfirmWalletCreateInputRight}>
      <div style={styles.inputForm}>
        <form style={styles.inputFormConfirmSeed}>
          <SeedEntry label="Seed Entry" onChange={setSeedWords}/>
        </form>
      </div>
      <div style={styles.inputFormError}>
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
