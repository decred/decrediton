import { useWatchtowersTab } from "./hooks";
import { FormattedMessage as T } from "react-intl";
import { useState } from "react";
import styles from "./WatchtowersTab.module.css";
import { TextInput } from "inputs";
import { Subtitle, Tooltip } from "shared";
import { KeyBlueButton } from "buttons";
import { CopyableText } from "pi-ui";

const AddWatchtower = ({
  addWatchtower,
  listWatchtowers
}) => {
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
            value={pubkey}
            onChange={(e) => setPubkey(e.target.value.trim())}
          />
        </div>
        <div className={styles.addWatchtowerNest}>
          <div className={styles.addWatchtowerNestPrefix}>
            <T id="ln.watchtowersTab.address" m="Address:" />
          </div>
          <TextInput
            value={addr}
            onChange={(e) => setAddr(e.target.value.trim())}
          />
        </div>
      </div>
      <KeyBlueButton
        className={styles.addWatchtowerButton}
        onClick={() => addWatchtower(pubkey, addr).then(() =>
          listWatchtowers())
        }>
        <T id="ln.watchtowersTab.addBtn" m="Add" />
      </KeyBlueButton>

    </div>
  );
};

const WatchtowersTab = () => {
  const {
    addWatchtower,
    removeWatchtower,
    listWatchtowers,
    towersList
  } = useWatchtowersTab();

  return (
    <>
      <Subtitle title={<T id="ln.watchtowersTab.addWatchtowerHeader" m="Add Watchtower" />} />
      <AddWatchtower
        addWatchtower={addWatchtower}
        listWatchtowers={listWatchtowers}
        towersList={towersList}
      />
      {towersList.length > 0 ? (
        <Subtitle title={<T id="ln.watchtowersTab.listWatchtowers" m="Watchtowers connected" />} />
      ) : null }

      {towersList.map((tower) =>
        <div
          className={`
            ${styles.tower} ${tower.activeSessionCandidate ? styles.statusTrue : styles.statusFalse}
          `}
          key={tower.pubkey}
        >
          <Tooltip
            className={styles.removeTowerBtn}
            text={
              <T id="ln.watchtowersTab.removeTowerBtn" m="Remove tower" />
            }><a
              className={styles.removeIcon}
              onClick={() => {
                removeWatchtower(tower.pubkeyHex);
                listWatchtowers();
              }}
              href="#">
              &times;
            </a></Tooltip>
          <p><T
            id="ln.watchtowersTab.sessions"
            m="Sessions {sessions}"
            values={{ sessions: tower.numSessions }}/></p>
          <CopyableText id="copyable" className={styles.copyableText}>{tower.pubkeyHex}</CopyableText>
          <div className={styles.addrsWrapper}>
            {tower.addressesList.map((addrs) => (
              <p key={`ips-${addrs}`}>{addrs}</p>
            ))}</div>
        </div>
      )}

    </>
  );
};

export default WatchtowersTab;
