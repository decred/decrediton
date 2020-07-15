import { FormattedMessage as T } from "react-intl";
import { TextInput, NumericInput } from "inputs";
import { Subtitle } from "shared";
import { PassphraseModalSwitch, AutoBuyerSwitch } from "buttons";
import "style/Privacy.less";
import { classNames } from "pi-ui";
import style from "./Privacy.module.css";

const PrivacyContent = ({
  mixedAccountName,
  mixedAccountBranch,
  changeAccountName,
  csppServer,
  csppPort,
  accountMixerError,
  accountMixerRunning,
  stopAccountMixer,
  onStartMixerAttempt
}) => (
  <>
    <Subtitle title={<T id="privacy.subtitle" m="Privacy" />} />
    <div className={classNames(style.pageWrapper, "is-column")}>
      <div className={classNames(style.isRow, style.row)}>
        <div className={classNames(style.isRow, style.item)}>
          <div className={""}>
            <T id="privacy.mixing.account" m="Mixing Account" />:
          </div>
          <TextInput required disabled value={mixedAccountName} />
        </div>
        <div className={style.item}>
          <div className={style.isRow}>
            <div className={""}>
              <T id="privacy.mixing.account.branch" m="Account Branch" />:
            </div>
            <NumericInput value={mixedAccountBranch} disabled />
          </div>
        </div>
      </div>
      <div className={classNames(style.isRow, style.row)}>
        <div className={classNames(style.isRow, style.item)}>
          <div className={""}>
            <T id="privacy.change.account" m="Change Account" />:
          </div>
          <TextInput required disabled value={changeAccountName} />
        </div>
      </div>
      <div className={classNames(style.isRow, style.row)}>
        <div className={classNames(style.isRow, style.item)}>
          <div className={""}>
            <T id="privacy.mixing.server" m="Shuffle Server" />:
          </div>
          <TextInput required disabled value={csppServer} />
        </div>
        <div className={classNames(style.isRow, style.item)}>
          <div className={""}>
            <T id="privacy.mixing.server.port" m="Shuffle Port" />:
          </div>
          <TextInput required disabled value={csppPort} />
        </div>
      </div>
      <div className={classNames(style.buttonArea, style.row)}>
        {accountMixerRunning ? (
          <AutoBuyerSwitch enabled onClick={stopAccountMixer} />
        ) : (
          <PassphraseModalSwitch
            modalTitle={
              <T id="privacy.start.mixer.confirmation" m="Start Mixer" />
            }
            buttonLabel={<T id="privacy.start.mixer" m="Start Mixer" />}
            modalDescription={
              <T
                id="privacy.mixer.modal.description"
                m={`Do you want to start the shuffle Mixer?
                Decrediton must remain running for mixer properly mix inputs.`}
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
    </div>
  </>
);

export default PrivacyContent;
