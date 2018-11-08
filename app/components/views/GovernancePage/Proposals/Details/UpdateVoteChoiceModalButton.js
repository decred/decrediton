import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";


export default ({ onUpdateVoteChoice, newVoteChoice }) => (
  <PassphraseModalButton
    modalTitle={
      <Aux>
        <T id="proposals.updateVoteChoiceModal.title" m="Confirm Your Vote" />
        <div className="proposal-vote-confirmation">
          <div className={newVoteChoice+"-proposal"}/>
          {newVoteChoice}
        </div>
      </Aux>}
    onSubmit={onUpdateVoteChoice}
    buttonLabel={<T id="proposals.updateVoteChoiceModal.btnLabel" m="Cast Vote" />}
  />
);
