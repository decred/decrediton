import { FormattedMessage as T } from "react-intl";
import { useDex } from "../hooks";
import { KeyBlueButton } from "buttons";

export const DexView = () => {
  const { onLaunchDexWindow } = useDex();

  return (
    <div>
      <KeyBlueButton onClick={onLaunchDexWindow}>
        <T id="dex.launchDexWindow" m="Launch DEX Window" />
      </KeyBlueButton>
    </div>
  );
};

export default DexView;
