import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton, InvisibleButton } from "buttons";
import { BackupRedeemScriptModal } from "modals";
import { CopyToClipboard } from "shared";
import styles from "./StakePools.module.css";

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
    <div className={styles.configuredVSPs}>
      <div className={styles.title}>Configured VSPs</div>
      <div>
        {configuredStakePools && configuredStakePools.length ? (
          configuredStakePools.map(
            ({ value: { Host, TicketAddress, PoolFees, Script } }) => {
              return (
                <div className={styles.configuredVSP} key={Host}>
                  <div
                    className={styles.close}
                    onClick={() => onRemoveStakePool(Host)}
                  />
                  <div className={styles.vspURL}>
                    <T
                      id="stakePoolsList.vspURL"
                      m="{value}"
                      values={{ value: Host }}
                    />
                  </div>
                  <div className={styles.poolFee}>
                    <T
                      id="stakePoolsList.poolFee"
                      m="Pool fees: {value}"
                      values={{
                        value: (
                          <span className={styles.poolFeePercentage}>
                            <T
                              id="stakePoolsList.poolFeePercentage"
                              m="{value} %"
                              values={{ value: PoolFees }}
                            />
                          </span>
                        )
                      }}
                    />
                  </div>
                  <div className={styles.vspData}>
                    <T
                      id="stakePoolsList.ticketAddress"
                      m="Ticket address: {value}"
                      values={{
                        value: (
                          <div className={styles.txDetails}>
                            {TicketAddress}
                          </div>
                        )
                      }}
                    />
                    <T
                      id="stakePoolsList.script"
                      m="Script: {value}"
                      values={{
                        value: (
                          <div className={styles.script}>
                            <div className={styles.txDetailsRaw}>{Script}</div>
                            <CopyToClipboard
                              className={styles.copyToClipboard}
                              textToCopy={Script}
                            />
                            <div className={styles.txDetailsRawShadow} />
                          </div>
                        )
                      }}
                    />
                  </div>
                  <div>
                    <BackupRedeemScriptModal
                      key={"modal" + Host}
                      className={styles.backupRedeemScriptModal}
                      show={showModal}
                      script={Script}
                      onCancelModal={toggleBackupModal}
                    />
                  </div>
                </div>
              );
            }
          )
        ) : (
          <T id="stakePoolsList.noVSPs" m="You have no configured VSPs" />
        )}
      </div>
    </div>
    <div className={styles.buttonContainer}>
      <InvisibleButton
        className={styles.cancelVSP}
        onClick={onHideStakePoolConfig}>
        <T id="stakepools.list.form.cancel" m="Cancel" />
      </InvisibleButton>
      <KeyBlueButton
        className={styles.addVSP}
        disabled={rescanRequest}
        onClick={onShowAddStakePool}>
        <T id="stakepools.list.form.submit" m="Add VSP" />
      </KeyBlueButton>
    </div>
  </>
);

StakePoolsList.propTypes = {
  configuredStakePools: PropTypes.array.isRequired,
  unconfiguredStakePools: PropTypes.array.isRequired,
  onShowAddStakePool: PropTypes.func.isRequired,
  onHideStakePoolConfig: PropTypes.func.isRequired
};

export default StakePoolsList;
