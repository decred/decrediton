import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";


export default ({ onUpdateVoteChoice, newVoteChoice, eligibleTicketCount }) => (
  <PassphraseModalButton
    modalTitle={
      <Aux>
        <T id="proposals.updateVoteChoiceModal.title" m="Confirm Your Vote" />
        <div className="proposal-vote-confirmation">
          <div className={newVoteChoice+"-proposal"}/>
          {newVoteChoice}
        </div>
      </Aux>}
    modalDescription={
      <T
        id="proposalDetails.votingInfo.eligibleCount"
        m="You have {count, plural, one {one ticket} other {# tickets}} eligible for voting"
        values={{ count: eligibleTicketCount }}
      />}
    disabled={!newVoteChoice}
    onSubmit={onUpdateVoteChoice}
    buttonLabel={<T id="proposals.updateVoteChoiceModal.btnLabel" m="Cast Vote" />}
  />
);
