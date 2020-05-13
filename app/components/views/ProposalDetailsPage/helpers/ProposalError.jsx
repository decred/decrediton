import { FormattedMessage as T } from "react-intl";

const ProposalError = ({ error }) => (
  <div>
    <T
      id="proposalDetails.loadingError"
      m="Error loading Proposal: {error}"
      values={{ error }}
    />
  </div>
);

export default ProposalError;
