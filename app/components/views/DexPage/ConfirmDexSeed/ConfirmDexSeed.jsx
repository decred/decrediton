import { useDex } from "../hooks";
import { useState } from "react";
import { Tooltip, classNames } from "pi-ui";
import { KeyBlueButton, CopyToClipboardButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import styles from "./ConfirmDexSeed.module.css";

const ConfirmDexSeed = () => {
  const { onConfirmDexSeed, dexSeed } = useDex();
  const [showSeed, setShowSeed] = useState(false);

  const onToggleSeed = () => {
    setShowSeed(!showSeed);
  };

  return (
    <div>
      <div
        className={classNames(
          styles.actions,
          styles.isRow,
          styles.seedInstructions
        )}>
        <T
          id="dex.instructions.seed"
          m="You should carefully write down your application
      seed and save a copy. Should you lose access to this machine or the
      critical application files, the seed can be used to restore your DEX accounts
       and native wallets. Some older accounts cannot be restored from seed,
       and whether old or new, it's good practice to backup the account keys
       separately from the seed."
        />
      </div>
      <div className={classNames(styles.actions, styles.isRow)}>
        <div className={styles.seed}>
          <div className={styles.seedLabel}>
            <T id="dex.seed" m="DEX Account Seed" />
          </div>
          {showSeed ? (
            <>
              <Tooltip
                content={
                  <T id="dex.hide.seed" m="Click to Hide DEX Account Seed" />
                }>
                <div className={styles.seedArea} onClick={onToggleSeed}>
                  {dexSeed}
                </div>
              </Tooltip>
              <CopyToClipboardButton
                textToCopy={dexSeed}
                className={styles.seedClipboard}
              />
            </>
          ) : (
            <div className={styles.seedAreaHidden} onClick={onToggleSeed}>
              <T id="dex.seed.Hidden" m="Click to reveal DEX Account Seed" />
            </div>
          )}
        </div>
      </div>
      <KeyBlueButton onClick={() => onConfirmDexSeed()}>
        {
          <T
            id="dex.confirmDexSeedButton"
            m="I have copied the DEX Account Seed"
          />
        }
      </KeyBlueButton>
    </div>
  );
};

export default ConfirmDexSeed;
