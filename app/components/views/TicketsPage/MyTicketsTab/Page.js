import TicketsCardList from "./TicketsCardList";
import { FormattedMessage as T } from "react-intl";
import InfiniteScroll from "react-infinite-scroller";
import { LoadingMoreTicketsIndicator, NoMoreTicketsIndicator } from "indicators";
import { Tooltip } from "shared";
import { EyeFilterMenu } from "buttons";
import "style/MyTickets.less";

@autobind
class TicketListPage extends React.Component {

  render() {
    const {
      tickets, noMoreTickets, decodeRawTicketTransactions,
      onLoadMoreTickets, onChangeSortType, onChangeSelectedType,
      selectedSortOrderKey, selectedTicketTypeKey,
      sortTypes, ticketTypes
     } = this.props;

    console.log("re-rendering ticketListPage");

    return (
        <InfiniteScroll
          hasMore={!noMoreTickets}
          loadMore={onLoadMoreTickets}
          initialLoad={false}
          useWindow={false}
          threshold={180}
        >
          <div className="tab-card">
            <div className="tickets-buttons-area">
              <Tooltip tipWidth={ 300 } text={<T id="transactions.sortby.tooltip" m="Sort By" />}>
                <EyeFilterMenu
                  labelKey="label"
                  keyField="value"
                  options={sortTypes}
                  selected={selectedSortOrderKey}
                  onChange={onChangeSortType}
                  className="sort-by"
                />
              </Tooltip>
              <Tooltip tipWidth={ 300 } text={<T id="transactions.txtypes.tooltip" m="Transaction Type" />}>
                <EyeFilterMenu
                  labelKey="label"
                  keyField="key"
                  options={ticketTypes}
                  selected={selectedTicketTypeKey}
                  onChange={onChangeSelectedType}
                />
              </Tooltip>
            </div>

            {tickets.length > 0
              ? <TicketsCardList {...{tickets, decodeRawTicketTransactions}} />
              : null}
            {!noMoreTickets
              ? <LoadingMoreTicketsIndicator />
              : <NoMoreTicketsIndicator /> }
          </div>
        </InfiniteScroll>
    );
  }
}

export default TicketListPage;
