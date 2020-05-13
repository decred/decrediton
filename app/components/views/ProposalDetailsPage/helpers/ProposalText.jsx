import { shell } from "electron";
import { InvisibleConfirmPoliteiaModalButton } from "buttons";
import { default as ReactMarkdown } from "react-markdown";
import { FormattedMessage as T } from "react-intl";

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
    onSubmit={() => shell.openExternal(href)}
  />
);

// This changes images to never open. Debatable whether we want to
// allow proposals to open images directly from decrediton.
const renderProposalImage = ({ alt }) => <span>{alt}</span>;

const ProposalText = ({ text }) => (
  <>
    <ReactMarkdown
      source={text}
      // NEVER set to false
      escapeHtml={true}
      // debatable whether we wanna allow the embedded html sections to be
      // shown. Theoretically, escapeHtml=true should suffice, but playing it
      // safe for the moment and also setting this as true.
      skipHtml={true}
      renderers={{
        link: renderInternalProposalLink,
        linkReference: renderInternalProposalLink,

        // debatable whether we wanna allow inline image references in proposals
        // in decrediton.
        imageReference: renderProposalImage,
        image: renderProposalImage,

        html: () => null
      }}
    />
  </>
);

export default ProposalText;
