import { FormattedMessage as T } from "react-intl";
import InfiniteScroll from "react-infinite-scroller";
import { LoadingMoreTicketsIndicator, NoMoreTicketsIndicator, NoTicketsIndicator } from "indicators";
import { TxHistory, Subtitle, Tooltip } from "shared";
import { EyeFilterMenu } from "buttons";
import "style/MyTickets.less";

const subtitleMenu = ({ sortTypes, ticketTypes, selectedSortOrderKey, selectedTicketTypeKey,
  onChangeSelectedType, onChangeSortType }) => (
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
);

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
      tickets, noMoreTickets, onLoadMoreTickets, onChangeSortType,
      onChangeSelectedType, selectedSortOrderKey, selectedTicketTypeKey,
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
        <Subtitle title={<T id="history.subtitle" m="My Tickets"/>} className={"is-row"}
          children={subtitleMenu({ sortTypes, ticketTypes, selectedSortOrderKey, selectedTicketTypeKey,
            onChangeSelectedType, onChangeSortType })} />
        <div className="history-page-content-wrapper">
          {tickets.length > 0
            ? <TxHistory {...{ transactions: tickets, tsDate, isStake: true }} />
            : null }
        </div>
        { !noMoreTickets
          ? <LoadingMoreTicketsIndicator />
          : tickets.length > 0
            ? <NoMoreTicketsIndicator />
            : <NoTicketsIndicator />
        }
      </InfiniteScroll>
    );
  }
}

export default TicketListPage;
