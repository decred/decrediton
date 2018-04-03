import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";

const VoteOption = ({ value, description, onClick, checked }) => (
  <div className="proposal-vote-option" onClick={() => onClick(value)}>
    <input type="radio" name="proposalVoteChoice" value={value} checked={checked} />
    {description}
  </div>
);

export default ({ voteOptions, onUpdateVoteChoice, onVoteOptionSelected, newVoteChoice }) => (
  <PassphraseModalButton
    modalTitle={<T id="proposals.updateVoteChoiceModal.title" m="Update Vote Choice" />}
    modalDescription={
      <div className="passphrase-modal-confirm-send">
        {voteOptions.map(o => (
          <VoteOption value={o.id} description={o.description} key={o.id} checked={o.id === newVoteChoice}
            onClick={onVoteOptionSelected}/>
        ))}
      </div>
    }
    onSubmit={onUpdateVoteChoice}
    buttonLabel={<T id="proposals.updateVoteChoiceModal.btnLabel" m="Update" />}
  />
);
