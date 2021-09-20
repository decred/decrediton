import { FormattedMessage as T, defineMessages } from "react-intl";
import Modal from "../Modal";
import styles from "./SearchForNodesModal.module.css";
import { Button } from "pi-ui";
import { TextInput } from "inputs";
import { useSearchForNodesModal } from "./hooks";
import { wallet } from "wallet-preload-shim";
import NodeListElement from "./NodeListElement";

const messages = defineMessages({
  searchInputPlaceholder: {
    id: "ln.searchForNodesModal.searchInputPlaceholder",
    defaultMessage: "Search the network by their name or Paste the Public Key"
  },
  searchInputLabel: {
    id: "ln.searchForNodesModal.searchInputLabel",
    defaultMessage: "Search the Network or Paste Public Key"
  }
});

const SearchForNodesModal = ({
  onCancelModal,
  show,
  onSubmit,
  recentnodes
}) => {
  const maxListSize = 5;

  const { node, setNode, searchResults, intl } = useSearchForNodesModal();
  const onNodeSelected = (value) => {
    setNode(null);
    onSubmit?.(value);
  };

  return (
    <Modal className={styles.modal} {...{ show, onCancelModal }}>
      <div className={styles.modalHeader}>
        <div className={styles.title}>
          <T id="ln.searchForNodesModal.title" m="Search For Nodes" />
        </div>
      </div>
      <div
        data-testid="closeSearchForNodesModalBt"
        className={styles.closeButton}
        onClick={onCancelModal}
      />

      <TextInput
        newBiggerFontStyle
        id="searchInput"
        value={node}
        inputClassNames={styles.searchInput}
        onChange={(e) => setNode(e.target.value)}
        placeholder={intl.formatMessage(messages.searchInputPlaceholder)}
        label={intl.formatMessage(messages.searchInputLabel)}>
        {!node ? (
          <Button
            kind="secondary"
            size="sm"
            className={styles.pasteButton}
            onClick={(e) => {
              e.preventDefault();
              setNode(wallet.readFromClipboard());
            }}>
            <T id="ln.searchForNodesModal.paste" m="Paste NodePubKey@ip:port" />
          </Button>
        ) : (
          <Button
            aria-label="Clear NodePubKey"
            kind="secondary"
            className={styles.clearAddressButton}
            onClick={(e) => {
              e.preventDefault();
              setNode("");
            }}>
            <div />
          </Button>
        )}
      </TextInput>
      <div className={styles.listsContainer}>
        {node ? (
          <div className={styles.list}>
            <div className={styles.listTitle}>
              <T
                id="ln.searchForNodesModal.searchResults"
                m="Search Results ({count})"
                values={{
                  count: searchResults?.length || 0
                }}
              />
            </div>
            <ul>
              {searchResults && searchResults.length > 0 ? (
                searchResults
                  .slice(0, maxListSize)
                  .map((node) => (
                    <NodeListElement
                      alias={node.alias}
                      pubKey={node.pubKey}
                      key={node.pubKey}
                      onNodeSelected={onNodeSelected}
                    />
                  ))
              ) : (
                <T
                  id="ln.searchForNodesModal.emptySearchResult"
                  m="No matching nodes found"
                />
              )}
            </ul>
          </div>
        ) : recentnodes && recentnodes.length > 0 ? (
          <div className={styles.list}>
            <div className={styles.listTitle}>
              <T id="ln.searchForNodesModal.recentNodes" m="Recent Nodes" />
            </div>
            <ul>
              {recentnodes.slice(0, maxListSize).map((node) => (
                <NodeListElement
                  alias={node.alias}
                  pubKey={node.pubKey}
                  key={node.pubKey}
                  onNodeSelected={onNodeSelected}
                />
              ))}
            </ul>
          </div>
        ) : (
          ""
        )}
      </div>
    </Modal>
  );
};

export default SearchForNodesModal;
