import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { activeVoteProposals, vettedProposals, proposals } from "connectors";
import { VotingProgress } from "indicators";
import { tsToDate } from "helpers";
import { StakeyBounce, NoProposals } from "indicators";

const ProposalListItem = ({ name, timestamp, token, voting, voteCounts, onClick }) => (
  <div className="proposal-list-item" onClick={() => onClick(token)}>
    <div className="info">
      <div className="proposal-name">{ name }</div>
      <div className="proposal-token">{ token }</div>
      <div className="proposal-timestamp">
        <T id="proposalItem.submittedAt" m="Submitted {reldate}" values={{
          reldate: <FormattedRelative  value={ tsToDate(timestamp) } /> }} />
      </div>
    </div>
    {voting ? <VotingProgress voteCounts={voteCounts} /> : null}
  </div>
);

const ProposalList = ({ proposals, loading, viewProposalDetails }) => (
  <Aux>
    { loading
      ? <StakeyBounce center />
      : proposals && proposals.length
        ? (
          <div className="proposal-list">
            {proposals.map(v => (
              <ProposalListItem key={v.token} {...v} onClick={viewProposalDetails} />
            ))}
          </div>
        )
        : <NoProposals />
    }
  </Aux>
);

export const ActiveVoteProposals = activeVoteProposals(proposals(ProposalList));
export const VettedProposals = vettedProposals(proposals(ProposalList));
