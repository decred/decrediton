import { FormattedMessage as T } from "react-intl";
import { StandaloneHeader, StandalonePage } from "layout";
import { AccountsSelect, TextInput, NumericInput } from "inputs";
import { Subtitle } from "shared";
import { PassphraseModalButton, PassphraseModalSwitch, AutoBuyerSwitch } from "buttons";
import cx from "classnames";
import "style/Privacy.less";

const PrivacyPage = ({
  mixedAccountName, setMixedAccountBranch, mixedAccountBranch, changeAccountName, setChangeAccount,
  onToggleStartMixer, canStartMixer, error, enabled, accountMixerRunning, stopAccountMixer, onStartMixerAttempt,
  csppServer, csppPort
}) => (
  <>
    <Subtitle title={<T id="privacy.subtitle" m="Privacy"/>} />

    <div className="privacy-page-wrapper is-column">
      <div className={ cx("is-row", "privacy-row") }>
        <div className={ cx("is-row", "privacy-item", error["mixedAccount"] && "error") }>
          <div className=""><T id="privacy.mixing.account" m="Mixing Account" />:</div>
          <TextInput required disabled value={mixedAccountName} />
        </div>

        <div className={cx("privacy-item", error["mixedAccountBranch"] && "error")}>
          <div className="is-row">
            <div className=""><T id="privacy.mixing.account.branch" m="Account Branch" />:</div>
            <NumericInput
              value={mixedAccountBranch} onChange={ e => setMixedAccountBranch(e.target.value)}
            />
          </div>
          { error["mixedAccountBranch"] }
        </div>
      </div>

      <div className={ cx("is-row", "privacy-row") }>
        <div className={cx("is-row", "privacy-item", error["changeAccount"] && "error")}>
          <div className=""><T id="privacy.change.account" m="Change Account" />:</div>
          <TextInput required disabled value={changeAccountName} />
        </div>
      </div>

      {
        error["sameAccount"] &&
        <div className="privacy-item error">{ error["sameAccount"] }</div>
      }

      <div className={ cx("is-row", "privacy-row") }>
        <div className={cx("is-row", "privacy-item", error["csppServer"] && "error")}>
          <div className=""><T id="privacy.mixing.server" m="Shuffle Server" />:</div>
          <TextInput
            required
            disabled
            value={csppServer}
          />
        </div>

        <div className={cx("is-row", "privacy-item", error["csppPort"] && "error")}>
          <div className=""><T id="privacy.mixing.server.port" m="Shuffle Port" />:</div>
          <TextInput
            required
            disabled
            value={csppPort}
          />
        </div>
      </div>
      <div className="button-area privacy-row">
        {
          accountMixerRunning ? <AutoBuyerSwitch enabled onClick={stopAccountMixer} /> :
            <PassphraseModalSwitch
              disabled={!canStartMixer}
              modalTitle={<T id="accounts.newAccountConfirmations" m="Start Mixer" />}
              buttonLabel={<T id="accounts.addNewButton" m="Start Mixer" />}
              modalDescription={<T id="privacy.mixer.modal.description"
                m = {`Do you want to start the shuffle Mixer?
                Decrediton must remain running for mixer properly mix inputs.`} />
              }
              className="start-mixer-button"
              onSubmit={ passaphrase => onStartMixerAttempt(passaphrase)}
            />
        }
      </div>
      {
        error["mixerStart"] && <div className="error">{error["mixerStart"]}</div>
      }
    </div>
  </>
);

export default PrivacyPage;
