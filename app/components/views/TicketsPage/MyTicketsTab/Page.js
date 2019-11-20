import TicketsCardList from "./TicketsCardList";
import { FormattedMessage as T } from "react-intl";
import InfiniteScroll from "react-infinite-scroller";
import { LoadingMoreTicketsIndicator, NoMoreTicketsIndicator, NoTicketsIndicator } from "indicators";
import { Tooltip } from "shared";
import { EyeFilterMenu } from "buttons";
import "style/MyTickets.less";

@autobind
class TicketListPage extends React.Component {

  componentDidMount() {
    if (!this.props.noMoreTickets) {
      // hack to load more items, so that the scroll doesn't get stuck and
      // can actually get triggered.
      this.props.onLoadMoreTickets();
    }
  }

  render() {
    const {
      tickets, noMoreTickets,
      onLoadMoreTickets, onChangeSortType, onChangeSelectedType,
      selectedSortOrderKey, selectedTicketTypeKey,
      sortTypes, ticketTypes, tsDate
    } = this.props;

    return (
      <InfiniteScroll
        hasMore={!noMoreTickets}
        loadMore={onLoadMoreTickets}
        initialLoad={false}
        useWindow={false}
        threshold={180}
      >
        <>
          <div className="tickets-buttons-area">
            <Tooltip tipWidth={300} text={<T id="tickets.sortby.tooltip" m="Sort By" />}>
              <EyeFilterMenu
                labelKey="label"
                keyField="value"
                options={sortTypes}
                selected={selectedSortOrderKey}
                onChange={onChangeSortType}
                className="sort-by"
              />
            </Tooltip>
            <Tooltip tipWidth={300} text={<T id="tickets.tickettypes.tooltip" m="Ticket Status" />}>
              <EyeFilterMenu
                labelKey="label"
                keyField="key"
                options={ticketTypes}
                selected={selectedTicketTypeKey}
                onChange={onChangeSelectedType}
              />
            </Tooltip>
          </div>
          {tickets.length === 0 ? <NoTicketsIndicator /> :
            <TicketsCardList {...{ tickets, tsDate }} />
          }
          {noMoreTickets ? tickets.length > 0 && <NoMoreTicketsIndicator /> : <LoadingMoreTicketsIndicator className="tickets-list-bottom" />}
        </>
      </InfiniteScroll>
    );
  }
}

export default TicketListPage;
