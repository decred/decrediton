import { FormattedMessage as T } from "react-intl";
import { StakeyBounceXs } from "indicators";
import styles from "./VotePreferenceWrapper.module.css";
import { useVotePreference } from "./hooks";
import VotePreference from "./VotePreference";

const VotePreferenceWrapper = ({
  viewedProposalDetails,
  voteOptions,
  currentVoteChoice,
  votingComplete
}) => {
  const {
    setVoteOption,
    newVoteChoice,
    state,
    voteSubmitHandler,
    eligibleTicketCount
  } = useVotePreference(viewedProposalDetails);

  switch (state.value) {
    case "idle":
    case "failure":
      return (
        <VotePreference
          {...{
            setVoteOption,
            newVoteChoice,
            eligibleTicketCount,
            currentVoteChoice,
            voteOptions,
            votingComplete,
            onVoteSubmit: voteSubmitHandler,
            votedSuccessfully: currentVoteChoice !== "abstain"
          }}
        />
      );
    case "loading":
      return (
        <div className={styles.stakeyWrapper}>
          <StakeyBounceXs />
          <T
            id="proposalDetails.votingInfo.updatingVoteChoice"
            m="Updating vote choice"
          />
          ...
        </div>
      );
    case "success":
      return (
        <VotePreference
          {...{
            setVoteOption,
            newVoteChoice,
            eligibleTicketCount,
            currentVoteChoice,
            voteOptions,
            votingComplete,
            onVoteSubmit: voteSubmitHandler,
            votedSuccessfully: true
          }}
        />
      );
  }
};

export default VotePreferenceWrapper;
