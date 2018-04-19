import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { activeVoteProposals, vettedProposals, proposals } from "connectors";
import { tsToDate } from "helpers";
import { StakeyBounce } from "indicators";

const ProposalListItem = ({ name, timestamp, token, onClick }) => (
  <div className="proposal-list-item" onClick={() => onClick(token)}>
    <div className="proposal-name">{ name }</div>
    <div className="proposal-token">{ token }</div>
    <div className="proposal-timestamp">
      <T id="proposalItem.submittedAt" m="Submitted {reldate}" values={{
        reldate: <FormattedRelative  value={ tsToDate(timestamp) } /> }} />
    </div>
  </div>
);

const ProposalList = ({ proposals, loading, viewProposalDetails }) => (
  <div className="proposal-list">
    {loading ? <StakeyBounce /> : proposals.map(v => (
      <ProposalListItem key={v.token} {...v} onClick={viewProposalDetails} />
    ))}
  </div>
);

export const ActiveVoteProposals = activeVoteProposals(proposals(ProposalList));
export const VettedProposals = vettedProposals(proposals(ProposalList));
