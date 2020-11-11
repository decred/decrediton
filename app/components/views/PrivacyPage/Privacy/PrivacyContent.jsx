import { FormattedMessage as T } from "react-intl";
import { Subtitle, PrivacyForm } from "shared";
import {
  InfoDocModalButton,
  MixerPassphraseModalSwitch,
  MixerSwitch
} from "buttons";
import "style/Privacy.less";
import { classNames } from "pi-ui";
import style from "./Privacy.module.css";

const PrivacyContent = ({
  accountMixerError,
  accountMixerRunning,
  stopAccountMixer,
  onStartMixerAttempt,
  logs
}) => (
  <>
    <Subtitle
      title={<T id="privacy.subtitle" m="Privacy" />}
      className={classNames(style.isRow)}
      children={
        <div className={classNames(style.contentTitleButtonsArea)}>
          <InfoDocModalButton
            document="MixerIntroduction"
            draggable
          />
        </div>
      }
    />
    <PrivacyForm
      className={classNames(style.pageWrapper, style.isColumn)}
    />
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
            onSubmit={(passaphrase) => onStartMixerAttempt(passaphrase)}
          />
        )}
    </div>
    {accountMixerError && (
      <div className={style.error}>{accountMixerError}</div>
    )}
    {/*
      TODO
      create a shared component and use it on logs page and here.
    */}
    <Subtitle title={<T id="privacy.logs" m="Logs" />} />
    <div className={style.logs}>
      <textarea rows="10" value={logs} disabled />
    </div>
  </>
);

export default PrivacyContent;
