import { ticketsList } from "connectors";
import TicketsCardList from "./TicketsCardList";
import { FormattedMessage as T } from "react-intl";
import InfiniteScroll from "react-infinite-scroller";
import { LoadingMoreTicketsIndicator, NoMoreTicketsIndicator } from "indicators";
import { statusMultipleTxt } from "./messages";
import { Tooltip } from "shared";
import { EyeFilterMenu } from "buttons";
import "style/MyTickets.less";

@autobind
class TicketListPage extends React.Component {

  constructor(props) {
    super(props);
    const selectedTicketTypeKey = this.selectedTicketTypeFromFilter(this.props.ticketsFilter);
    const selectedSortOrderKey = this.props.ticketsFilter.listDirection;
    this.state = {selectedTicketTypeKey, selectedSortOrderKey};
  }

  onLoadMoreTickets() {
    console.log("do load more tickets please");
    setTimeout(() => this.props.getTickets && this.props.getTickets(), 10);
  }

  getSortTypes() {
    return [
      {value: "desc", label: (<T id="tickets.sortby.newest" m="Newest"/>)},
      {value: "asc", label: (<T id="tickets.sortby.oldest" m="Oldest"/>)}
    ];
  }

  getTicketTypes() {
    const labels = statusMultipleTxt;
    return [
      {key: "all",      value: {status: []},  label: (<T id="tickets.type.all" m="All"/>)},
      {key: "unmined",      value: {status: ["unmined"]},  label: labels.unmined},
      {key: "immature",      value: {status: ["immature"]},  label: labels.immature},
      {key: "live",      value: {status: ["live"]},  label: labels.live},
      {key: "voted",      value: {status: ["voted"]},  label: labels.voted},
      {key: "missed",      value: {status: ["missed"]},  label: labels.missed},
      {key: "expired",      value: {status: ["expired"]},  label: labels.expired},
      {key: "revoked",      value: {status: ["revoked"]},  label: labels.revoked}
    ];
  }

  selectedTicketTypeFromFilter(filter) {
    if (filter.status.length === 0) return "all";
    const status = this.getTicketTypes();
    status.shift(); //drop "all" which doesn't have value.types
    return status.reduce((a, v) =>
      (v.value.status[0] === filter.status[0])
        ? v.key : a, null);

  }

  onChangeFilter(value) {
    const newFilter = {
      ...this.props.ticketsFilter,
      ...value
    };
    this.props.changeTicketsFilter(newFilter);
  }

  onChangeSelectedType(type) {
    this.onChangeFilter(type.value);
    this.setState({selectedTicketTypeKey: type.key});
  }

  onChangeSortType(type) {
    this.onChangeFilter({listDirection: type.value});
    this.setState({selectedSortOrderKey: type.value});
  }

  render() {
    const { tickets, noMoreTickets, decodeRawTicketTransactions } = this.props;
    const { onLoadMoreTickets, onChangeSortType, onChangeSelectedType } = this;
    const { selectedSortOrderKey, selectedTicketTypeKey } = this.state;
    const sortTypes = this.getSortTypes();
    const ticketTypes = this.getTicketTypes();

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

export default ticketsList(TicketListPage);
