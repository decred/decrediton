import { ticketsList } from "connectors";
import TicketsCardList from "./TicketsCardList";
import { FormattedMessage as T } from "react-intl";
import InfiniteScroll from "react-infinite-scroller";
import { LoadingMoreTicketsIndicator, NoMoreTicketsIndicator } from "indicators";
import "style/MyTickets.less";

@autobind
class TicketListPage extends React.Component {

  requestTicketsRawTx() {
    const { tickets } = this.props;
    const toDecode = tickets.reduce((a, t) => {
      if (!t.decodedTicketTx) {
        a.push(t.ticketRawTx);
        if (t.spenderHash) {
          a.push(t.spenderRawTx);
        }
      }
      return a;
    }, []);
    this.props.decodeRawTransactions(toDecode);
  }

  onLoadMoreTickets() {
    console.log("do load more tickets please");
    setTimeout(() => this.props.getTickets && this.props.getTickets(), 10);
  }

  render() {
    const { tickets, noMoreTickets } = this.props;
    const { onLoadMoreTickets } = this;
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
            {tickets.length > 0
              ? <TicketsCardList tickets={tickets} />
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
