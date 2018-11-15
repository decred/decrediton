import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { activeVoteProposals, preVoteProposals, votedProposals, proposals } from "connectors";
import { VotingProgress } from "indicators";
import { PoliteiaLoading, NoProposals } from "indicators";
import { VOTESTATUS_ACTIVEVOTE, VOTESTATUS_VOTED } from "actions/GovernanceActions";

const VoteChoice = ({ currentVoteChoice }) =>
  <div className={"proposal-vote-choice " + currentVoteChoice}/>;
const VoteResults = ({ currentVoteChoice, quorumPass, voteResult }) => (
  <div className="proposal-vote-result">
    <div className="proposal-vote-choice-area">
      <div className={"proposal-vote-choice " + currentVoteChoice}/>
      <div className="proposal-vote-choice-text">{currentVoteChoice !== "abstain" ? <Aux><T id="proposal.voted" m="Voted"/> {currentVoteChoice}</Aux> : <T id="proposal.noVote" m="No vote cast"/>}</div>
    </div>
    <div className="proposal-vote-passage">{quorumPass ? voteResult : <T id="proposals.quorumNotMet" m="Quorum not met"/>}</div>
  </div>
);

const ProposalListItem = ({ name, timestamp, token, voteCounts, tsDate, onClick, voteStatus, currentVoteChoice, quorumPass, voteResult }) => (
  <div className={"proposal-list-item " + voteResult} onClick={() => onClick(token)}>
    <div className="info">
      <div className="proposal-name">{ name }</div>
      <div className="proposal-token">{ token }</div>
      {voteStatus !== VOTESTATUS_VOTED &&
      <div className="proposal-timestamp">
        <T id="proposalItem.lastUpdatedAt" m="Last Updated {reldate}" values={{
          reldate: <FormattedRelative  value={ tsDate(timestamp) } /> }} />
      </div>}
    </div>
    {voteStatus == VOTESTATUS_ACTIVEVOTE &&
      <Aux>
        <VoteChoice currentVoteChoice={currentVoteChoice} />
        <VotingProgress voteCounts={voteCounts} />
      </Aux>}
    {voteStatus == VOTESTATUS_VOTED &&
      <VoteResults  {...{ currentVoteChoice, quorumPass, voteResult }}/>}
  </div>
);

const ProposalList = ({ proposals, loading, viewProposalDetails, tsDate, voteEnded }) => (
  <Aux>
    { loading
      ? <div className="proposal-loading-page"><PoliteiaLoading center /></div>
      : proposals && proposals.length
        ? (
          <div className={voteEnded ? "proposal-list ended" : "proposal-list"}>
            {proposals.map(v => (
              <ProposalListItem key={v.token} {...v} tsDate={tsDate} onClick={viewProposalDetails} />
            ))}
          </div>
        )
        : <NoProposals />
    }
  </Aux>
);

export const ActiveVoteProposals = activeVoteProposals(proposals(ProposalList));
export const PreVoteProposals = preVoteProposals(proposals(ProposalList));
export const VotedProposals = votedProposals(proposals(ProposalList));
