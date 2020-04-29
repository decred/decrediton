import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton, SlateGrayButton, RemoveStakePoolButton } from "buttons";
import { BackupRedeemScriptModal } from "modals";
import "style/Layout.less";
import "style/StakePool.less";

const StakePoolsList = ({
  configuredStakePools,
  onShowAddStakePool,
  onHideStakePoolConfig,
  onRemoveStakePool,
  rescanRequest,
  toggleBackupModal,
  showModal
}) => (
  <>
    <div className="stakepool-flex-height">
      <div className="stakepool-content-nest-from-address">
        <div className="stakepool-content-nest-prefix-configured">
          <T id="stakepools.list.title" m="Configured VSP:" />
        </div>
      </div>
      <div id="dynamicInput">
        {configuredStakePools.map(
          ({ value: { Host, TicketAddress, PoolFees, Script } }) => (
            <div key={Host}>
              <div className="stakepool-content-nest-stake-pool">
                <div className="stakepool-content-nest-settings">
                  <div className="stakepool-content-nest-prefix-settings">
                    <T id="stakepools.list.form.field.url" m="URL:" />
                  </div>
                  <div className="stakepool-content-nest-content-settings">
                    {Host}
                  </div>
                </div>
                <div className="stakepool-content-nest-settings">
                  <div className="stakepool-content-nest-prefix-settings">
                    <T
                      id="stakepools.list.form.field.ticketaddress"
                      m="Ticket Address:"
                    />
                  </div>
                  <div className="stakepool-content-nest-content-settings">
                    {TicketAddress}
                  </div>
                </div>
                <div className="stakepool-content-nest-settings">
                  <div className="stakepool-content-nest-prefix-settings">
                    <T id="stakepools.list.form.field.script" m="Script:" />
                  </div>
                  <textarea
                    disabled
                    value={Script}
                    className="stakepool-content-nest-content-settings"
                  />
                </div>
                <div className="stakepool-content-nest-settings">
                  <div className="stakepool-content-nest-prefix-settings">
                    <T
                      id="stakepools.list.form.field.poolfees"
                      m="Pool Fees:"
                    />
                  </div>
                  <div className="stakepool-content-nest-content-settings">
                    {PoolFees}
                  </div>
                </div>
                <div className="stakepool-content-nest-settings-bottom">
                  <div className="stakepool-content-nest-prefix-settings"></div>
                  <div className="stakepool-content-nest-content-settings">
                    <RemoveStakePoolButton
                      modalTitle={
                        <T
                          id="stakepools.list.removeConfirmTitle"
                          m="Remove VSP"
                        />
                      }
                      buttonLabel={
                        <T id="stakepools.list.btnRemove" m="Remove" />
                      }
                      modalContent={
                        <T
                          id="stakepools.list.confirmRemove"
                          m="Do you confirm removal of VSP {stakepool}?"
                          values={{
                            stakepool: <span className="mono">{Host}</span>
                          }}
                        />
                      }
                      onSubmit={() => onRemoveStakePool(Host)}
                    />
                  </div>
                </div>
              </div>
              <BackupRedeemScriptModal
                key={"modal" + Host}
                className="backup-redeem-script-modal"
                show={showModal}
                script={Script}
                onCancelModal={toggleBackupModal}
              />
            </div>
          )
        )}
      </div>
    </div>
    <KeyBlueButton
      className="stakepool-content-send"
      disabled={rescanRequest}
      onClick={onShowAddStakePool}>
      <T id="stakepools.list.form.submit" m="Add VSP" />
    </KeyBlueButton>
    <SlateGrayButton
      className="stakepool-hide-config"
      onClick={onHideStakePoolConfig}>
      <T id="stakepools.list.form.cancel" m="Cancel" />
    </SlateGrayButton>
  </>
);

StakePoolsList.propTypes = {
  configuredStakePools: PropTypes.array.isRequired,
  unconfiguredStakePools: PropTypes.array.isRequired,
  onShowAddStakePool: PropTypes.func.isRequired,
  onHideStakePoolConfig: PropTypes.func.isRequired
};

export default StakePoolsList;
