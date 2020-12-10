import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";
import { useLoadingMoreTickets } from "./hooks";
import "style/Loading.less";

const DescMessage = ({ startRequestHeight, currentBlockHeight }) => (
  <T
    id="myTickets.loadingMoreTicketsProgressDesc"
    m="Down to block {block} ({blockPerc, number, percent})"
    values={{
      block: startRequestHeight,
      blockPerc: (currentBlockHeight - startRequestHeight) / currentBlockHeight
    }}
  />
);

const AscMessage = ({ startRequestHeight, currentBlockHeight }) => (
  <T
    id="myTickets.loadingMoreTicketsProgressAsc"
    m="Up to block {block} ({blockPerc, number, percent})"
    values={{
      block: startRequestHeight,
      blockPerc: startRequestHeight / currentBlockHeight
    }}
  />
);

const LoadingMoreTicketsIndicator = ({
  className,
  isLiveTickets
}) => {
  const {
    startRequestHeight,
    ticketsFilter,
    currentBlockHeight,
    stakeTransactionsCancel,
    onToggleGetTransactions
  } = useLoadingMoreTickets();

  return stakeTransactionsCancel ? (
    <div className={"loading-more-tickets is-row " + className}>
      {startRequestHeight && (
        <>
          <div className="is-row loading-more-tickets-info">
            <div className="loading-more-tickets-icon"></div>
            <T
              id="myTickets.noloadingMoreTickets"
              m="Loading more tickets canceled"
            />
          </div>
          <Tooltip
              text={
                <T
                  id="mytickets.loadingMoreTickets.returnBtn"
                  m={"Return listing tickets"}
                />
              }>
              <button
                className={"gettickets-cancel-button"}
                onClick={onToggleGetTransactions}
              />
            </Tooltip>
        </>
      )}
    </div>
  ) : (
      <div className={"loading-more-tickets is-row " + className}>
        {startRequestHeight && (
          <>
            <div className="is-row loading-more-tickets-info">
              <div className="loading-more-tickets-icon"></div>
              <div>
                <>
                  <T
                    id="myTickets.loadingMoreTickets"
                    m="Loading more tickets..."
                  />
                  <div className="loading-more-tickets-progress-line">
                    {
                      // removing this for now on live tickets, but it should
                      // have its own proportion between 0-100%
                      !isLiveTickets && (
                        ticketsFilter.listDirection === "desc" ? (
                          <DescMessage {...{ startRequestHeight, currentBlockHeight }} />
                        ) : (
                            <AscMessage {...{ startRequestHeight, currentBlockHeight }} />
                          )
                      )
                    }
                    {}
                  </div>
                </>
              </div>
            </div>
            <Tooltip
              text={
                <T
                  id="mytickets.loadingMoreTickets.cancelBtn"
                  m={"Cancel listing tickets"}
                />
              }>
              <button
                className={"gettickets-cancel-button"}
                onClick={onToggleGetTransactions}
              />
            </Tooltip>
          </>
        )}
      </div>
    );
};

export default LoadingMoreTicketsIndicator;
