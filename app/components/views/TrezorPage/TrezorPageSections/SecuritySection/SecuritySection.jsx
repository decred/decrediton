import { FormattedMessage as T } from "react-intl";
import { ToggleSwitch } from "buttons";
import styles from "./SecuritySection.module.css";
import SwitchStatusLabel from "./SwitchStatusLabel";

const SecuritySection = ({
  ContainerComponent,
  performingTogglePinProtection,
  performingTogglePassphraseProtection,
  performingTogglePassphraseOnDeviceProtection,
  pinProtection,
  passphraseProtection,
  passphraseOnDeviceProtection,
  performingOperation,
  togglePinProtection,
  togglePassPhraseProtection,
  togglePassphraseOnDevice
}) => (
  <ContainerComponent label={<T id="trezor.security.header" m="Security" />}>
    <div className={styles.toggleSwitchWrapper}>
      <ToggleSwitch
        id="togglePinProtection"
        className={styles.switch}
        onClick={togglePinProtection}
        enabled={!!pinProtection}
        loading={
          performingOperation ||
          performingTogglePinProtection ||
          pinProtection === undefined
        }
        tooltipClassName={styles.tooltipClassName}
        enabledText={
          <T
            id="trezorPage.security.pinProtection.enabled"
            m="Disable PIN Protection"
          />
        }
        notEnabledText={
          <T
            id="trezorPage.security.pinProtection.not.enabled"
            m="Enable PIN Protection"
          />
        }
      />
      <label htmlFor="togglePinProtection">
        <T
          id="trezorPage.security.togglePinProtection"
          m="Toggle PIN Protection ({status})"
          values={{
            status: (
              <SwitchStatusLabel
                performing={performingTogglePinProtection}
                value={pinProtection}
              />
            )
          }}
        />
      </label>
    </div>

    <div className={styles.toggleSwitchWrapper}>
      <ToggleSwitch
        id="togglePassPhraseProtection"
        className={styles.switch}
        onClick={togglePassPhraseProtection}
        enabled={!!passphraseProtection}
        loading={
          performingOperation ||
          performingTogglePassphraseProtection ||
          passphraseProtection === undefined
        }
        tooltipClassName={styles.tooltipClassName}
        enabledText={
          <T
            id="trezorPage.security.passphraseProtection.enabled"
            m="Disable Passphrase Protection"
          />
        }
        notEnabledText={
          <T
            id="trezorPage.security.passphraseProtection.not.enabled"
            m="Enable Passphrase Protection"
          />
        }
      />
      <label htmlFor="togglePassPhraseProtection">
        <T
          id="trezorPage.security.togglePassPhraseProtection"
          m="Toggle Passphrase Protection ({status})"
          values={{
            status: (
              <SwitchStatusLabel
                performing={performingTogglePassphraseProtection}
                value={passphraseProtection}
              />
            )
          }}
        />
      </label>
    </div>

    <div className={styles.toggleSwitchWrapper}>
      <ToggleSwitch
        id="togglePassphraseOnDevice"
        className={styles.switch}
        onClick={togglePassphraseOnDevice}
        enabled={!!passphraseOnDeviceProtection}
        loading={
          performingOperation ||
          performingTogglePassphraseOnDeviceProtection ||
          passphraseOnDeviceProtection === undefined
        }
        tooltipClassName={styles.tooltipClassName}
        enabledText={
          <T
            id="trezorPage.security.passphraseOnDeviceProtection.enabled"
            m="Disable Passphrase On Device Protection"
          />
        }
        notEnabledText={
          <T
            id="trezorPage.security.passphraseOnDeviceProtection.not.enabled"
            m="Enable Passphrase On Device Protection"
          />
        }
      />
      <label htmlFor="togglePassphraseOnDevice">
        <T
          id="trezorPage.security.togglePassphraseOnDevice"
          m="Toggle Passphrase Protection On Device ({status})"
          values={{
            status: (
              <SwitchStatusLabel
                performing={performingTogglePassphraseOnDeviceProtection}
                value={passphraseOnDeviceProtection}
              />
            )
          }}
        />
      </label>
    </div>
  </ContainerComponent>
);

export default SecuritySection;
