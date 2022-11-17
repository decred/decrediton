import { FormattedMessage as T } from "react-intl";
import { useDex } from "../hooks";
import { classNames, Checkbox } from "pi-ui";
import { useInitPage } from "./hooks";
import { SetNewPassphraseModalButton } from "buttons";
import { TextInput } from "inputs";
import styles from "./InitPage.module.css";

const InitPage = () => {
  const { onInitDex, onInitDexWithSeed, initDexAttempt } = useDex();
  const {
    hasSeed,
    toggleHasSeed,
    seed,
    setSeed,
    onInitDexCall,
    seedError
  } = useInitPage({
    onInitDex,
    onInitDexWithSeed
  });

  return (
    <div className={styles.container}>
      <div>
        <T
          id="dex.newPassphrase"
          m="Please set a new passphrase for the DEX.  You may use the same passphrase as you use for your wallet, or choose a new one."
        />
      </div>
      <div className="margin-top-s">
        <T
          id="dex.newPassphraseNote"
          m="Note: If you lose the DEX passphrase, you will be forced to create a new DEX account and pay your registration fee again."
        />
      </div>
      <Checkbox
        label={
          <T
            id="dex.hasDexSeed.label"
            m="I already have a DEX seed to recover."
          />
        }
        id="hasDexSeed"
        description={
          <T
            id="dex.hasDexSeed.description"
            m="A DEX seed allows you to recover your account at a particular server and your native DEX wallets."
          />
        }
        checked={hasSeed}
        onChange={toggleHasSeed}
        className="margin-top-s"
      />
      {hasSeed && (
        <>
          <TextInput
            id="dexSeed"
            className={classNames("margin-top-m", styles.seedInput)}
            required
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="DEX Seed"
          />
          {seedError && <div className="error">{seedError}</div>}
        </>
      )}
      <SetNewPassphraseModalButton
        className="margin-top-m"
        disabled={initDexAttempt}
        modalTitle={<T id="dex.initPassphrase" m="Set DEX Passphrase" />}
        loading={initDexAttempt}
        onSubmit={onInitDexCall}
        buttonLabel={<T id="dex.initPassphraseButton" m="Set DEX Passphrase" />}
      />
    </div>
  );
};

export default InitPage;
