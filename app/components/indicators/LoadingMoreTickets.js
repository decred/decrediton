import StakeyBounceXs from "./StakeyBounceExtraSmall";
import { loadingTickets } from "connectors";
import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";
import "style/Loading.less";

const DescMessage = ({ startRequestHeight, currentBlockHeight }) =>
  <T id="myTickets.loadingMoreTicketsProgressDesc"
    m="Down to block {block} ({blockPerc, number, percent})"
    values={{
      block: startRequestHeight,
      blockPerc: (currentBlockHeight - startRequestHeight) / currentBlockHeight
    }}
  />;

const AscMessage = ({ startRequestHeight, currentBlockHeight }) =>
  <T id="myTickets.loadingMoreTicketsProgressAsc"
    m="Up to block {block} ({blockPerc, number, percent})"
    values={{
      block: startRequestHeight,
      blockPerc: (startRequestHeight / currentBlockHeight)
    }}
  />;

const CancelLoadingTicketsButton = ({ cancelGetTickets }) => (
  <Tooltip text={ <T id="mytickets.loadingMoreTickets.cancelBtn" m={"Cancel listing tickets"} /> }>
    <button
      className={"gettickets-cancel-button"}
      onClick={cancelGetTickets} />
  </Tooltip>
);

const LoadingTicketsProgress = ({ startRequestHeight, ticketsFilter, currentBlockHeight, cancelGetTickets }) =>
  <div className="loading-more-tickets-progress-line">
    {
      ticketsFilter.listDirection === "desc"
        ? <DescMessage {...{ startRequestHeight, currentBlockHeight }} />
        : <AscMessage {...{ startRequestHeight, currentBlockHeight }} />
    }
    <CancelLoadingTicketsButton cancelGetTickets={cancelGetTickets} />
  </div>;

const LoadingMoreTicketsIndicator = ({ startRequestHeight, ...props }) =>
  <div className="loading-more-transactions-indicator">
    <StakeyBounceXs /><T id="myTickets.loadingMoreTickets" m="Loading more tickets..." />
    { startRequestHeight && <LoadingTicketsProgress { ...{ startRequestHeight, ...props }} /> }
  </div>;

export default loadingTickets(LoadingMoreTicketsIndicator);
