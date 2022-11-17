import { FormattedMessage as T } from "react-intl";
import UISettings from "./UISettings";
import MiscSettings from "./MiscSettings";
import TimezoneSettings from "./TimezoneSettings";
import LauncherSettings from "./LauncherSettings";
import { Subtitle } from "shared";
import styles from "./GeneralSettings.module.css";
import { Wrapper, Group } from "../helpers";
import { classNames } from "pi-ui";

const GeneralSettings = ({
  tempSettings,
  currencies,
  locales,
  onChangeTempSettings,
  walletReady,
  wrapperClassName,
  uiBoxClassName,
  uiGroupClassName,
  timezoneBoxClassName
}) => (
  <Wrapper className={classNames(styles.wrapper, wrapperClassName)}>
    <Group>
      <Subtitle
        className={styles.subtitle}
        title={
          <T id="settings.getstartpage.group-title.launcher" m="Launcher" />
        }
      />
      <LauncherSettings {...{ tempSettings, onChangeTempSettings }} />
    </Group>
    <Group>
      <Subtitle
        className={styles.subtitle}
        title={
          <T id="settings.getstartpage.group-title.timezone" m="Timezone" />
        }
      />
      <TimezoneSettings
        {...{ tempSettings, onChangeTempSettings, timezoneBoxClassName }}
      />
    </Group>

    {walletReady && (
      <Group>
        <Subtitle
          className={styles.subtitle}
          title={<T id="settings.getstartpage.group-title.misc" m="Misc" />}
        />
        <MiscSettings
          {...{
            tempSettings,
            currencies,
            onChangeTempSettings
          }}
        />
      </Group>
    )}
    <Group className={classNames(styles.uiGroup, uiGroupClassName)}>
      <Subtitle
        className={styles.subtitle}
        title={<T id="settings.getstartpage.group-title.ui" m="UI" />}
      />
      <UISettings
        {...{ tempSettings, locales, onChangeTempSettings, uiBoxClassName }}
      />
    </Group>
  </Wrapper>
);

GeneralSettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  locales: PropTypes.array,
  onChangeTempSettings: PropTypes.func.isRequired,
  wrapperClassName: PropTypes.string,
  uiBoxClassName: PropTypes.string,
  uiGroupClassName: PropTypes.string,
  timezoneBoxClassName: PropTypes.string
};

export default GeneralSettings;
