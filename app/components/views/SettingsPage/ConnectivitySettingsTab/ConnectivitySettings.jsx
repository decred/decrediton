import { FormattedMessage as T } from "react-intl";
import NetworkSettings from "./NetworkSettings";
import ProxySettings from "./ProxySettings";
import { Subtitle } from "shared";
import styles from "./ConnectivitySettings.module.css";
import { Wrapper, Group, ConfirmRestartModal } from "../helpers";

const ConnectivitySettings = ({
  tempSettings,
  onChangeTempSettings,
  onSaveSettings,
  showConfirmModal,
  onCancelConfirmModal,
  wrapperClassName
}) => (
  <Wrapper className={wrapperClassName}>
    <Group>
      <Subtitle
        className={styles.subtitle}
        title={<T id="settings.getstartpage.group-title.network" m="Network" />}
      />
      <NetworkSettings
        {...{
          tempSettings,
          onChangeTempSettings
        }}
      />
    </Group>

    <Group>
      <Subtitle
        className={styles.subtitle}
        title={<T id="settings.getstartpage.group-title.proxy" m="Proxy" />}
      />
      <ProxySettings {...{ tempSettings, onChangeTempSettings }} />
    </Group>

    <ConfirmRestartModal
      show={showConfirmModal}
      onSubmit={onSaveSettings}
      onCancelModal={onCancelConfirmModal}
    />
  </Wrapper>
);

ConnectivitySettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  onChangeTempSettings: PropTypes.func.isRequired,
  onSaveSettings: PropTypes.func.isRequired,
  showConfirmModal: PropTypes.bool.isRequired,
  onCancelConfirmModal: PropTypes.func.isRequired,
  wrapperClassName: PropTypes.string
};

export default ConnectivitySettings;
