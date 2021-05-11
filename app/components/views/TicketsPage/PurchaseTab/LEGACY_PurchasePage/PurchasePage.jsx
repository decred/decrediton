import { FormattedMessage as T } from "react-intl";
import { Checkbox } from "pi-ui";
import { StakeyBounce } from "indicators";
import StakePools from "./LEGACY_StakePools/StakePoolsList";
import Tickets from "./LEGACY_Tickets";
import { useLegacyPurchasePage } from "./hooks";
import { EnableExternalRequestButton } from "buttons";
import { ExternalLink } from "shared";
import { EXTERNALREQUEST_STAKEPOOL_LISTING } from "constants";
import StakePoolsAddForm from "./LEGACY_AddForm";
import styles from "./PurchasePage.module.css";

const StakepoolListingDisabled = React.memo(() => (
  <div>
    <p>
      <T
        id="stake.enableStakePoolListing.description"
        m="VSP listing from external API endpoint is currently disabled. Please enable the access to this third party service or manually configure the VSP."
      />
    </p>
    <EnableExternalRequestButton
      requestType={EXTERNALREQUEST_STAKEPOOL_LISTING}>
      <T id="stake.enableStakePoolListing.button" m="Enable VSP Listing" />
    </EnableExternalRequestButton>
  </div>
));

const NoAvailableStakepools = React.memo(({ toggleIsLegacy }) => (
  <>
    <T
      id="stake.noAvailableStakepools"
      m="No VSP found. Check your internet connection or {link} to see if the VSP API is down."
      values={{
        link: (
          <ExternalLink
            href="https://api.decred.org/?c=gsd"
            className={styles.stakepoolLink}>
            <T id="stake.discoverStakeOoolsAPILink" m="this link" />
          </ExternalLink>
        )
      }}
    />
    <Checkbox
      className="margin-top-m"
      label={<T id="stake.isLegacy" m="Use Legacy VSP" />}
      id="box"
      checked={true}
      onChange={() => toggleIsLegacy(false)}
    />
  </>
));

const PurchasePage = ({
  isShowingVsp,
  toggleShowVsp,
  toggleIsLegacy,
  ...props
}) => {
  const {
    onShowAddStakePool,
    toggleBackupModal,
    getNoAvailableStakepools,
    getStakepoolListingEnabled,
    getIsAdding,
    showModal,
    onRemoveStakePool,
    configuredStakePools,
    rescanRequest,
    selectedUnconfigured,
    unconfiguredStakePools,
    apiKey,
    isSavingStakePoolConfig,
    onChangeSelectedUnconfigured,
    onChangeApiKey,
    onSetStakePoolInfo,
    onCancelAddStakePool,
    hasFailedAttempt,
    addCustomStakePool,
    onEnableTicketAutoBuyer,
    onDisableTicketAutoBuyer,
    isTicketAutoBuyerEnabled,
    notMixedAccounts,
    getRunningIndicator,
    isPurchasingTickets
  } = useLegacyPurchasePage(toggleShowVsp);
  return getNoAvailableStakepools && !getStakepoolListingEnabled() ? (
    <StakepoolListingDisabled />
  ) : getNoAvailableStakepools ? (
    <NoAvailableStakepools toggleIsLegacy={toggleIsLegacy} />
  ) : isPurchasingTickets ? (
    <StakeyBounce center />
  ) : getIsAdding ? (
    <StakePoolsAddForm
      {...{
        selectedUnconfigured,
        unconfiguredStakePools,
        configuredStakePools,
        apiKey,
        isSavingStakePoolConfig,
        onChangeSelectedUnconfigured,
        onChangeApiKey,
        onSetStakePoolInfo,
        onCancelAddStakePool,
        hasFailedAttempt,
        toggleIsLegacy,
        addCustomStakePool
      }}
    />
  ) : isShowingVsp ? (
    <StakePools
      {...{
        configuredStakePools,
        onRemoveStakePool,
        showModal,
        toggleShowVsp,
        toggleBackupModal,
        onShowAddStakePool,
        rescanRequest,
        ...props
      }}
    />
  ) : (
    <Tickets
      {...{
        toggleIsLegacy,
        toggleShowVsp,
        configuredStakePools,
        onEnableTicketAutoBuyer,
        onDisableTicketAutoBuyer,
        isTicketAutoBuyerEnabled,
        notMixedAccounts,
        getRunningIndicator,
        ...props
      }}
    />
  );
};

export default PurchasePage;
