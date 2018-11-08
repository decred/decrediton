import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";


export default ({ onUpdateVoteChoice, newVoteChoice }) => (
  <PassphraseModalButton
    modalTitle={<T id="proposals.updateVoteChoiceModal.title" m="Confirm Vote Choice" />}
    modalDescription={newVoteChoice}
    onSubmit={onUpdateVoteChoice}
    buttonLabel={<T id="proposals.updateVoteChoiceModal.btnLabel" m="Cast Vote" />}
  />
);
