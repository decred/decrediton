import { FormattedMessage as T, FormattedRelative } from "react-intl";
import { activeVoteProposals, vettedProposals } from "connectors";
import { tsToDate } from "helpers";

const ProposalListItem = ({ name, timestamp, token }) => (
  <div className="proposal-list-item">
    <div className="proposal-name">{ name }</div>
    <div className="proposal-token">{ token }</div>
    <div className="proposal-timestamp">
      <T id="proposalItem.submittedAt" m="Submitted {reldate}" values={{
        reldate: <FormattedRelative  value={ tsToDate(timestamp) } /> }} />
    </div>
  </div>
);

const ProposalList = ({ proposals }) => (
  <div className="proposal-list">
    {proposals.map(v => (
      <ProposalListItem key={v.token} {...v} />
    ))}
  </div>
);

export const ActiveVoteProposals = activeVoteProposals(ProposalList);
export const VettedProposals = vettedProposals(ProposalList);
