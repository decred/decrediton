import { FormattedMessage as T } from "react-intl";
import { classNames, CopyableText, Tooltip } from "pi-ui";
import { useWatchtowers } from "./hooks";
import styles from "./Watchtowers.module.css";
import { Subtitle } from "shared";
import AddWatchtower from "./AddWatchtower";

const Watchtowers = () => {
  const { addWatchtower, removeWatchtower, listWatchtowers, towersList } =
    useWatchtowers();

  return (
    <>
      <AddWatchtower
        addWatchtower={addWatchtower}
        listWatchtowers={listWatchtowers}
        towersList={towersList}
      />
      {towersList.length > 0 && (
        <Subtitle
          title={
            <T
              id="ln.watchtowersTab.listWatchtowers"
              m="Watchtowers connected"
            />
          }
        />
      )}
      {towersList.map((tower) => (
        <div
          className={classNames(
            styles.tower,
            tower.activeSessionCandidate
              ? styles.statusTrue
              : styles.statusFalse
          )}
          key={tower.pubkey}>
          <Tooltip
            className={styles.removeTowerBtn}
            content={
              <T id="ln.watchtowersTab.removeTowerBtn" m="Remove tower" />
            }>
            <a
              className={styles.removeIcon}
              onClick={() => {
                removeWatchtower(tower.pubkeyHex);
                listWatchtowers();
              }}
              href="#">
              &times;
            </a>
          </Tooltip>
          <p>
            <T
              id="ln.watchtowersTab.sessions"
              m="Sessions: {sessions}"
              values={{ sessions: tower.numSessions }}
            />
          </p>
          <CopyableText id="copyable" className={styles.copyableText}>
            {tower.pubkeyHex}
          </CopyableText>
          <div className={styles.addrsWrapper}>
            {tower.addressesList.map((addrs) => (
              <p key={`ips-${addrs}`}>{addrs}</p>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default Watchtowers;
