import { useState } from "react";
import styles from "./shared.module.css";
import { classNames } from "pi-ui";
import PropTypes from "prop-types";

const Collapse = ({ isInfo, header, content }) => {
  const [show, setShow] = useState(false);
  return (
    <div className={classNames(styles.collapse, isInfo && styles.info)}>
      <div onClick={() => setShow(!show)}>{header}</div>
      <div
        className={classNames(styles.readMoreIcon, show && styles.active)}
        onClick={() => setShow(!show)}
      />
      {show && <div className={styles.content}>{content}</div>}
    </div>
  );
};

Collapse.propTypes = {
  header: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  isInfo: PropTypes.bool
};

export default Collapse;
