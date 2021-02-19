import { useDex } from "./hooks";
import { KeyBlueButton } from "buttons";
import { StandaloneHeader } from "layout";
import { FormattedMessage as T } from "react-intl";
import { LN_ICON } from "constants";

export const DexViewContent = () => {
  const { onLaunchDexWindow } = useDex();

  return (
    <div>
      <KeyBlueButton onClick={onLaunchDexWindow}>
        <T id="dex.launchDexWindow" m="Launch DEX Window" />
      </KeyBlueButton>
    </div>
  );
};

export const DexViewHeader = () => (
  <StandaloneHeader
    title={<T id="dex.launchDexWindow.title" m="Launch Dex Window" />}
    description={
      <T
        id="dex.launchDexWIndow.description"
        m={"Launch the window to access the DEX"}
      />
    }
    iconType={LN_ICON}
  />
);
