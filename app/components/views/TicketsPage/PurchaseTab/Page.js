import React from "react";
import TabContent from "../../../TabbedPage/TabContent";
import ReactToolTip from "react-tooltip";
import StakeyBounce from "../../../StakeyBounce";
import PurchaseTicketsInfo from "../../../PurchaseTicketsInfo";
import StakePools from "../../../StakePools";
import Tickets from "./Tickets";
import "style/Layout.less";
import "style/StakePool.less";

const PurchasePage = ({
  isSavingStakePoolConfig,
  isPurchasingTickets,
  stakePool,
  isShowingTicketsInfo,
  isShowingStakePools,
  onHideTicketsInfo,
  onHideStakePoolConfig,
  ...props
}) => (
  <TabContent>
    {(isSavingStakePoolConfig || isPurchasingTickets)
      ? <StakeyBounce/>
      : (isShowingStakePools)
        ? <StakePools {...{ onHideStakePoolConfig }} />
          : isShowingTicketsInfo
            ? <PurchaseTicketsInfo closeModal={onHideTicketsInfo} />
            : <Tickets {...{ stakePool, ...props }} />
    }
    <ReactToolTip type="info" effect="solid"/>
  </TabContent>
);

export default PurchasePage;
