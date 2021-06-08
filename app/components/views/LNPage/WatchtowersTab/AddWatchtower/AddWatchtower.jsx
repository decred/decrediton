import { useState } from "react";
import { FormattedMessage as T } from "react-intl";
import styles from "./AddWatchtower.module.css";
import { TextInput } from "inputs";
import { KeyBlueButton } from "buttons";

const AddWatchtower = ({ addWatchtower, listWatchtowers }) => {
  const [pubkey, setPubkey] = useState("");
  const [addr, setAddr] = useState("");

  return (
    <div className={styles.addWatchtower}>
      <div className={styles.addWatchtowerContent}>
        <div className={styles.addWatchtowerNest}>
          <div className={styles.addWatchtowerNestPrefix}>
            <T id="ln.watchtowersTab.Pubkey" m="Tower ID:" />
          </div>
          <TextInput
            id="towerIdInput"
            value={pubkey}
            onChange={(e) => setPubkey(e.target.value.trim())}
          />
        </div>
        <div className={styles.addWatchtowerNest}>
          <div className={styles.addWatchtowerNestPrefix}>
            <T id="ln.watchtowersTab.address" m="Address:" />
          </div>
          <TextInput
            id="addressInput"
            value={addr}
            onChange={(e) => setAddr(e.target.value.trim())}
          />
        </div>
      </div>
      <KeyBlueButton
        className={styles.addWatchtowerButton}
        onClick={() =>
          addWatchtower(pubkey, addr).then(() => listWatchtowers())
        }>
        <T id="ln.watchtowersTab.addBtn" m="Add" />
      </KeyBlueButton>
    </div>
  );
};

export default AddWatchtower;
