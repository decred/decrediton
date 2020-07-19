import { ticketsList } from "connectors";
import TicketListPage from "./Page";
import { FormattedMessage as T } from "react-intl";
import { substruct } from "fp";

const labels = {
  unknown: <T id="ticket.status.multiple.unknown" m="unknown" />,
  unmined: <T id="ticket.status.multiple.unmined" m="unmined" />,
  immature: <T id="ticket.status.multiple.immature" m="immature" />,
  live: <T id="ticket.status.multiple.live" m="live" />,
  voted: <T id="ticket.status.multiple.voted" m="voted" />,
  missed: <T id="ticket.status.multiple.missed" m="missed" />,
  expired: <T id="ticket.status.multiple.expired" m="expired" />,
  revoked: <T id="ticket.status.multiple.revoked" m="revoked" />
};

@autobind
class MyTickets extends React.Component {
  constructor(props) {
    super(props);
    const selectedTicketTypeKey = this.selectedTicketTypeFromFilter(
      this.props.ticketsFilter
    );
    const selectedSortOrderKey = this.props.ticketsFilter.listDirection;
    this.state = { selectedTicketTypeKey, selectedSortOrderKey };
  }

  getSortTypes() {
    return [
      {
        value: "desc",
        key: "desc",
        label: <T id="tickets.sortby.newest" m="Newest" />
      },
      {
        value: "asc",
        key: "asc",
        label: <T id="tickets.sortby.oldest" m="Oldest" />
      }
    ];
  }

  // TODO use constants
  getTicketTypes() {
    return [
      {
        key: "all",
        value: { status: null },
        label: <T id="tickets.type.all" m="All" />
      },
      { key: "unmined", value: { status: "unmined" }, label: labels.unmined },
      {
        key: "immature",
        value: { status: "immature" },
        label: labels.immature
      },
      { key: "live", value: { status: "live" }, label: labels.live },
      { key: "voted", value: { status: "voted" }, label: labels.voted },
      { key: "missed", value: { status: "missed" }, label: labels.missed },
      { key: "expired", value: { status: "expired" }, label: labels.expired },
      { key: "revoked", value: { status: "revoked" }, label: labels.revoked }
    ];
  }

  selectedTicketTypeFromFilter(filter) {
    const types = this.getTicketTypes();
    let key;
    types.forEach((type) => {
      if (filter.status === type.value.status) {
        key = type.key;
        return;
      }
    });
    return key;
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
    const loadMoreThreshold =
      90 + Math.max(0, this.props.window.innerHeight - 765);
    return (
      <TicketListPage
        {...{
          ...this.props,
          ...this.state,
          loadMoreThreshold,
          ticketTypes: this.getTicketTypes(),
          sortTypes: this.getSortTypes(),
          tickets: this.props.tickets,
          ...substruct(
            {
              onChangeSelectedType: null,
              onChangeSortType: null
            },
            this
          )
        }}
      />
    );
  }
}

export default ticketsList(MyTickets);
