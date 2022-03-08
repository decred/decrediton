import { wallet } from "wallet-preload-shim";
import { InvisibleConfirmPoliteiaModalButton } from "buttons";
import { default as ReactMarkdown } from "react-markdown";
import { FormattedMessage as T } from "react-intl";
import gfm from "remark-gfm";
import "./styles.css";

// This changes links to never open. Debatable whether we want to
// allow proposals to link somewhere directly from decrediton.
const renderInternalProposalLink = ({ children, href }) => (
  <InvisibleConfirmPoliteiaModalButton
    modalTitle={
      <T
        id="politeia.details.openLinkModal"
        m="Open Link in External Browser"
      />
    }
    modalContent={
      <T
        id="politeia.details.openLinkModalDesc"
        m="Click Confirm to open the link: {link} in an external browser."
        values={{ link: <span>{href}</span> }}
      />
    }
    buttonComponent={<span>{children}</span>}
    buttonLabel={
      <a onClick={() => {}} href="#">
        {children}
      </a>
    }
    onSubmit={() => wallet.openExternalURL(href)}
  />
);

// This changes images to never open. Debatable whether we want to
// allow proposals to open images directly from decrediton.
const renderProposalImage = ({ alt }) => <span>{alt}</span>;

const ProposalBody = ({ body }) => (
  <>
    <ReactMarkdown
      className="markdown-body"
      children={body}
      skipHtml={true}
      remarkPlugins={[gfm]}
      unwrapDisallowed={true}
      components={{
        a: renderInternalProposalLink,

        // debatable whether we wanna allow inline image references in proposals
        // in decrediton.
        img: renderProposalImage
      }}
    />
  </>
);

export default ProposalBody;
