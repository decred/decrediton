import { classNames } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { PassphraseModalButton } from "buttons";
import { fetchMachine } from "stateMachines/FetchStateMachine";
import { useMachine } from "@xstate/react";
import { StakeyBounceXs } from "indicators";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { ProposalError } from "./helpers";
import * as gov from "actions/GovernanceActions";
import styles from "./ProposalDetails.module.css";

const VoteOption = ({ value, description, onClick, checked }) => (
  <div className={styles.voteOption}>
    <input className={value} type="radio" id={value} name="proposalVoteChoice"
      readOnly={!onClick} onChange={onClick}
      value={value}
      checked ={checked}
    />
    <label className={classNames(styles.radioLabel, styles[value])} htmlFor={value}/>{description}
  </div>
);

function UpdateVoteChoiceModalButton({ onSubmit, newVoteChoice, eligibleTicketCount }) {
  return (
    <PassphraseModalButton
      modalTitle={
        <>
          <T id="proposals.updateVoteChoiceModal.title" m="Confirm Your Vote" />
          <div className={styles.voteConfirmation}>
            <div className={styles[`${newVoteChoice}Proposal`]}/>
            {newVoteChoice}
          </div>
        </>
      }
      modalDescription={
        <T
          id="proposalDetails.votingInfo.eligibleCount"
          m="You have {count, plural, one {one ticket} other {# tickets}} eligible for voting"
          values={{ count: eligibleTicketCount }}
        />
      }
      disabled={!newVoteChoice}
      onSubmit={onSubmit}
      buttonLabel={<T id="proposals.updateVoteChoiceModal.btnLabel" m="Cast Vote" />}
    />
  );}

const getError = (error) => {
  if (!error) return;
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    if (error.message) return error.message;
    return JSON.stringify(error);
  }
};

function ChooseVoteOption({
  viewedProposalDetails, voteOptions, currentVoteChoice, votingComplete, eligibleTicketCount
}) {
  const [ newVoteChoice, setVoteOption ] = useState(null);

  const dispatch = useDispatch();
  const onUpdateVoteChoice = (privatePassphrase) => dispatch(
    gov.updateVoteChoice(viewedProposalDetails, newVoteChoice, privatePassphrase)
  );
  const [ state, send ] = useMachine(fetchMachine, {
    actions: {
      initial: () => ({}),
      load: (context, event) => {
        const { privatePassphrase } = event;
        if(!newVoteChoice) return;
        onUpdateVoteChoice(privatePassphrase)
          .then(() => send("RESOLVE"))
          .catch(error => send({ type: "REJECT", error }));
      }
    }
  });

  const error = state && state.context && getError(state.context.error);
  const ChooseOptions = () => (
    <>
      <div className={styles.votingPreference}>
        <div className={styles.preferenceTitle}><T id="proposalDetails.votingInfo.votingPreferenceTitle" m="My Voting Preference" /></div>
        <div>
          { voteOptions.map(o => {
            return <VoteOption
              value={o.id}  key={o.id}
              description={o.id.charAt(0).toUpperCase()+o.id.slice(1)}
              onClick={ () => currentVoteChoice === "abstain" && setVoteOption(o.id) }
              checked={ newVoteChoice ? newVoteChoice === o.id : currentVoteChoice !== "abstain" ? currentVoteChoice.id === o.id : null }
            />;
          })}
        </div>
      </div>
      { !votingComplete &&
        <UpdateVoteChoiceModalButton {...{
          newVoteChoice, onSubmit: (privatePassphrase) => send({ type: "FETCH", privatePassphrase }), eligibleTicketCount
        }} />
      }
    </>
  );

  switch (state.value) {
  case "idle":
    return <ChooseOptions {...{
      setVoteOption, newVoteChoice, eligibleTicketCount, currentVoteChoice,
      voteOptions, votingComplete
    }} />;
  case "loading":
    return (
      <div className={styles.voteChoice}>
        <StakeyBounceXs />
        <T id="proposalDetails.votingInfo.updatingVoteChoice" m="Updating vote choice" />...
      </div>
    );
  case "success":
    return <ChooseOptions {...{
      setVoteOption, newVoteChoice, eligibleTicketCount, currentVoteChoice,
      voteOptions, votingComplete
    }} />;
  case "failure":
    return <ProposalError {...{ error }} />;
  }
}

export default ChooseVoteOption;
