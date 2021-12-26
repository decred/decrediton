import { FormattedMessage as T } from "react-intl";
import UISettings from "./UISettings";
import MiscSettings from "./MiscSettings";
import TimezoneSettings from "./TimezoneSettings";
import { Subtitle } from "shared";
import styles from "./GeneralSettings.module.css";
import { Wrapper, Group, GroupWrapper } from "../helpers";

const GeneralSettings = ({
  tempSettings,
  currencies,
  locales,
  onChangeTempSettings,
  walletReady
}) => (
  <Wrapper>
    <GroupWrapper className={styles.twoColumns}>
      <Group>
        <Subtitle
          className={styles.subtitle}
          title={
            <T id="settings.getstartpage.group-title.timezone" m="Timezone" />
          }
        />
        <TimezoneSettings {...{ tempSettings, onChangeTempSettings }} />
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
    </GroupWrapper>

    <GroupWrapper>
      <Group>
        <Subtitle
          className={styles.subtitle}
          title={<T id="settings.getstartpage.group-title.ui" m="UI" />}
        />
        <UISettings {...{ tempSettings, locales, onChangeTempSettings }} />
      </Group>
    </GroupWrapper>
  </Wrapper>
);

GeneralSettings.propTypes = {
  tempSettings: PropTypes.object.isRequired,
  currencies: PropTypes.array.isRequired,
  locales: PropTypes.array,
  onChangeTempSettings: PropTypes.func.isRequired
};

export default GeneralSettings;
