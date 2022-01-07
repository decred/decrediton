import { useDex } from "../hooks";
import { KeyBlueButton } from "buttons";
import { FormattedMessage as T } from "react-intl";

const ConfirmDexSeed = () => {
  const { onConfirmDexSeed, dexSeed } = useDex();

  return (
    <div>
      <div>{dexSeed}</div>
      <KeyBlueButton
        onClick={() => onConfirmDexSeed()}
      >
        {<T id="dex.confirmDexSeedButton" m="Confirm DEX Seed" />}
      </KeyBlueButton>
    </div>
  );
};

export default ConfirmDexSeed;
