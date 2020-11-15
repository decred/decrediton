import { useState } from "react";
import { FormattedMessage as T } from "react-intl";
import { Subtitle, PrivacyForm, Log } from "shared";
import {
  InfoDocModalButton,
  MixerPassphraseModalSwitch,
  MixerSwitch
} from "buttons";
import { classNames, Checkbox } from "pi-ui";
import { SendFromUnmixedAccountModal } from "modals";
import style from "./Privacy.module.css";

const PrivacyContent = ({
  accountMixerError,
  accountMixerRunning,
  stopAccountMixer,
  onStartMixerAttempt,
  logs,
  allowSendFromUnmixed,
  onToggleSendFromUnmixed,
  showingSendUnmixModal,
  showModal,
  onChangeCheckbox
}) => {
  const [expandedLogs, setExpandedLogs] = useState(false);

  const onHideLog = () => setExpandedLogs(false);

  const onShowLog = () => setExpandedLogs(true);

  return (
    <>
      <Subtitle
        title={<T id="privacy.subtitle" m="Privacy" />}
        className={classNames(style.isRow)}
        children={
          <div className={classNames(style.contentTitleButtonsArea)}>
            <InfoDocModalButton document="MixerIntroduction" draggable />
          </div>
        }
      />
      <PrivacyForm className={classNames(style.pageWrapper, style.isColumn)} />
      <div className={classNames(style.buttonArea, style.row)}>
        {accountMixerRunning ? (
          <MixerSwitch enabled onClick={stopAccountMixer} />
        ) : (
          <MixerPassphraseModalSwitch
            modalTitle={
              <T id="privacy.start.mixer.confirmation" m="Start Mixer" />
            }
            buttonLabel={<T id="privacy.start.mixer" m="Start Mixer" />}
            modalDescription={
              <T
                id="privacy.mixer.modal.description"
                m={`Do you want to start the mixer?
                Decrediton should not be closed while the mixer is running.`}
              />
            }
            className={style.startMixerButton}
            onSubmit={(passaphrase) => { 
              onShowLog();
              onStartMixerAttempt(passaphrase);
            }}
          />
        )}
      </div>
      {accountMixerError && (
        <div className={style.error}>{accountMixerError}</div>
      )}
      <SendFromUnmixedAccountModal
        show={showingSendUnmixModal}
        onSubmit={onToggleSendFromUnmixed}
        onCancelModal={() => showModal(false)}
      />
      <Checkbox
        label={
          <T
            id="privacy.sendFromUnmixedCheckbox"
            m="Send from unmixed accounts"
          />
        }
        id="privacyCheckbox"
        checked={allowSendFromUnmixed}
        onChange={onChangeCheckbox}
      />
      <Log
        title={<T id="privacy.logs" m="Logs" />}
        log={logs}
        expanded={expandedLogs}
        onShowLog={onShowLog}
        onHideLog={onHideLog}
      />
    </>
  );
};

export default PrivacyContent;
