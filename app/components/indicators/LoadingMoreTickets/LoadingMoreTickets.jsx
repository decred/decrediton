import { classNames, Tooltip } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { useLoadingMoreTickets } from "./hooks";
import styles from "./LoadingMoreTickets.module.css";

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
  isLiveTickets,
  getTickets
}) => {
  const {
    startRequestHeight,
    ticketsFilter,
    currentBlockHeight,
    transactionsRequestAttempt,
    stakeTransactionsCancel,
    onToggleGetTransactions
  } = useLoadingMoreTickets();

  return stakeTransactionsCancel ? (
    <div
      className={classNames(
        styles.loadingMoreTickets,
        styles.isRow,
        className
      )}>
      {startRequestHeight && (
        <>
          <div
            className={classNames(styles.isRow, styles.loadingMoreTicketsInfo)}>
            <div className={styles.loadingMoreTicketsIcon}></div>
            <T
              id="myTickets.noloadingMoreTickets"
              m="Loading more tickets canceled"
            />
          </div>
          <Tooltip
            content={
              <T
                id="mytickets.loadingMoreTickets.returnBtn"
                m={"Return listing tickets"}
              />
            }>
            <button
              className={styles.getticketsCancelButton}
              onClick={onToggleGetTransactions}
            />
          </Tooltip>
        </>
      )}
    </div>
  ) : (
    <div
      className={classNames(
        styles.loadingMoreTickets,
        styles.isRow,
        className
      )}>
      {startRequestHeight && (
        <>
          <div
            className={classNames(styles.isRow, styles.loadingMoreTicketsInfo)}>
            <div className={styles.loadingMoreTicketsIcon}></div>
            <div onClick={() => !transactionsRequestAttempt && getTickets()}>
              <>
                <T
                  id="myTickets.loadingMoreTickets"
                  m="Loading more tickets..."
                />
                <div className={styles.loadingMoreTicketsProgressLine}>
                  {
                    // removing this for now on live tickets, but it should
                    // have its own proportion between 0-100%
                    !isLiveTickets &&
                      (ticketsFilter.listDirection === "desc" ? (
                        <DescMessage
                          {...{ startRequestHeight, currentBlockHeight }}
                        />
                      ) : (
                        <AscMessage
                          {...{ startRequestHeight, currentBlockHeight }}
                        />
                      ))
                  }
                  {}
                </div>
              </>
            </div>
          </div>
          <Tooltip
            content={
              <T
                id="mytickets.loadingMoreTickets.cancelBtn"
                m={"Cancel listing tickets"}
              />
            }>
            <button
              className={styles.getticketsCancelButton}
              onClick={onToggleGetTransactions}
            />
          </Tooltip>
        </>
      )}
    </div>
  );
};

export default LoadingMoreTicketsIndicator;
