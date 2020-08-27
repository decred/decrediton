import { StakeyBounce } from "indicators";
import StakePools from "./LEGACY_StakePools/StakePoolsList";
import Tickets from "./LEGACY_Tickets";
// after stop supporting old vsp code, we can remove this connector
import { useLegacyPurchasePage } from "./hooks";
import { EnableExternalRequestButton } from "buttons";
import { ExternalLink } from "shared";
import { EXTERNALREQUEST_STAKEPOOL_LISTING } from "main_dev/externalRequests";
import { FormattedMessage as T } from "react-intl";
import StakePoolsAddForm from "./LEGACY_AddForm";

const StakepoolListingDisabled = React.memo(() =>
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
);

const NoAvailableStakepools = React.memo(() =>
  <T
    id="stake.noAvailableStakepools"
    m="No VSP found. Check your internet connection or {link} to see if the VSP API is down."
    values={{
      link: (
        <ExternalLink href="https://api.decred.org/?c=gsd" className="stakepool-link">
          <T id="stake.discoverStakeOoolsAPILink" m="this link" />
        </ExternalLink>
      )
    }}
  />
);

const LEGACY_PurchasePage = ({
  isPurchasingTickets,
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
    hasFailedAttempt
  } = useLegacyPurchasePage(toggleShowVsp);

  console.log("isPurchasingTickets isPurchasingTickets isPurchasingTickets isPurchasingTickets", isPurchasingTickets);

  return (
    getNoAvailableStakepools && !getStakepoolListingEnabled()) ?
    <StakepoolListingDisabled /> :
    getNoAvailableStakepools ?
      <NoAvailableStakepools /> :
      getIsAdding ?
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
            toggleIsLegacy
          }}
        /> :
        isPurchasingTickets ? (
          <StakeyBounce center />
        ) : isShowingVsp ? (
          <StakePools {...{
            configuredStakePools,
            onRemoveStakePool,
            showModal,
            toggleShowVsp,
            toggleBackupModal,
            onShowAddStakePool,
            rescanRequest,
            ...props
          }} />
        ) : (
              <Tickets {...{
                toggleIsLegacy,
                toggleShowVsp,
                ...props
              }} />
            );
};

export default LEGACY_PurchasePage;
