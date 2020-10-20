import { trezor } from "connectors";
import { FormattedMessage as T } from "react-intl";
import ConfigSections from "views/TrezorPage/ConfigSections";
import Page from "./Page";
import { InvisibleButton } from "buttons";
import { useEffect } from "react";

const TrezorConfig = ({
  enableTrezor,
  device,
  performingOperation,
  connect,
  ...props
}) => {
  useEffect(() => {
    enableTrezor();
  }, [enableTrezor]);

  const renderNoDevice = (
    <>
      <div>
        <T
          id="trezor.getStartedConfig.noDeviceFound"
          m="No trezor device found. Check the connection and the trezor bridge software."
        />
      </div>
      <div>
        <InvisibleButton onClick={connect}>
          <T
            id="trezor.getStartedConfig.btnConnect"
            m="Connect to Trezor"
          />
        </InvisibleButton>
      </div>
    </>
  );

  const children = !device ? (
    renderNoDevice
  ) : (
    <ConfigSections device={device} loading={performingOperation} {...props} />
  );

  return <Page {...props}>{children}</Page>;
};

export default trezor(TrezorConfig);
