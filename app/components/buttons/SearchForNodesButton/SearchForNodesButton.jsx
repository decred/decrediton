import { SearchForNodesModal } from "modals";
import ModalButton from "../ModalButton";
import styles from "./SearchForNodesButton.module.css";
import { classNames, Icon, Button } from "pi-ui";

const SearchForNodesButton = ({
  className,
  recentNodes,
  onSubmit,
  buttonLabel
}) => (
  <ModalButton
    className={classNames(styles.button, className)}
    modalComponent={SearchForNodesModal}
    buttonComponent={Button}
    recentnodes={recentNodes}
    onSubmit={onSubmit}
    data-testid="searchForNodesButton"
    buttonLabel={
      buttonLabel ? buttonLabel : <Icon type="search" iconColor="#fff" />
    }></ModalButton>
);

export default SearchForNodesButton;
