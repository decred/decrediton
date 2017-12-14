const VoteChoice = ({ agendaId, choice }) =>
  <span className="vote-choice">
    <span className="vote-choice-agenda-id">{agendaId}: </span>
    <span className="vote-choice-choice">{choice}</span>
  </span>;

export default VoteChoice;
