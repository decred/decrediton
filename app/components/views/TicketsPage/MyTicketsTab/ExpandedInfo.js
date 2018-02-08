import { FormattedMessage as T } from "react-intl";
import { TransactionLink } from "buttons";
import VoteChoice from "./VoteChoice";

const ExpandedInfo = ({ ticket }) => (
  <div className="ticket-expanded-info">
    <div>
      <span className="ticket-info-label"><T id="myTickets.ticketTx" m="Transaction"/>:</span>
      <span className="ticket-transaction-hash">
        <TransactionLink txHash={ticket.hash} />
      </span>
    </div>

    { ticket.spenderTx
      ? (<div>
        <span className="ticket-info-label"><T id="myTickets.spenderTx" m="Spender"/>:</span>
        <span className="ticket-transaction-hash">
          <TransactionLink txHash={ticket.spenderHash} />
        </span>
      </div>)
      : null }

    { ticket.voteChoices
      ? (<div>
        <span className="ticket-info-label"><T id="myTickets.voteChoices" m="Vote"/>:</span>
        <span className="ticket-transaction-hash">
          {Object.keys(ticket.voteChoices).map((agendaId =>
            <VoteChoice {...{ agendaId, key: agendaId, choice: ticket.voteChoices[agendaId] }} />
          )) }
        </span>
      </div>)
      : null }

  </div>
);

export default ExpandedInfo;
