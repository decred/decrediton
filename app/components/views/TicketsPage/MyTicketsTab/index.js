import { ticketsList } from "connectors";
import TicketListPage from "./Page";
import { statusMultipleTxt } from "./messages";
import { FormattedMessage as T } from "react-intl";
import { substruct } from "fp";

@autobind
class MyTickets extends React.Component {
  constructor(props) {
    super(props);
    const selectedTicketTypeKey = this.selectedTicketTypeFromFilter(this.props.ticketsFilter);
    const selectedSortOrderKey = this.props.ticketsFilter.listDirection;
    this.state = { selectedTicketTypeKey, selectedSortOrderKey };
  }

  onLoadMoreTickets() {
    setTimeout(() => this.props.getTickets && this.props.getTickets(), 10);
  }

  getSortTypes() {
    return [
      { value: "desc", label: (<T id="tickets.sortby.newest" m="Newest" />) },
      { value: "asc", label: (<T id="tickets.sortby.oldest" m="Oldest" />) }
    ];
  }

  getTicketTypes() {
    const labels = statusMultipleTxt;
    return [
      { key: "all", value: { status: [] }, label: (<T id="tickets.type.all" m="All" />) },
      { key: "unmined", value: { status: [ "unmined" ] }, label: labels.unmined },
      { key: "immature", value: { status: [ "immature" ] }, label: labels.immature },
      { key: "live", value: { status: [ "live" ] }, label: labels.live },
      { key: "voted", value: { status: [ "voted" ] }, label: labels.voted },
      { key: "missed", value: { status: [ "missed" ] }, label: labels.missed },
      { key: "expired", value: { status: [ "expired" ] }, label: labels.expired },
      { key: "revoked", value: { status: [ "revoked" ] }, label: labels.revoked }
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
    this.setState({ selectedTicketTypeKey: type.key });
  }

  onChangeSortType(type) {
    this.onChangeFilter({ listDirection: type.value });
    this.setState({ selectedSortOrderKey: type.value });
  }

  render() {
    return <TicketListPage
      {...{
        ...this.props,
        ...this.state,
        ticketTypes: this.getTicketTypes(),
        sortTypes: this.getSortTypes(),
        ...substruct({
          onChangeSelectedType: null,
          onChangeSortType: null,
          onLoadMoreTickets: null
        }, this)
      }}
    />;
  }
}

export default ticketsList(MyTickets);
