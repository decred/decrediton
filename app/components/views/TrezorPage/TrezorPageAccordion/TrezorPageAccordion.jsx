import { useState } from "react";
import { VerticalAccordion } from "shared";
import styles from "./TrezorPageAccordion.module.css";

const TrezorPageAccordion = ({ children, label }) => {
  const [show, setShow] = useState(false);

  const onToggleAccordion = () => {
    setShow(!show);
  };

  return (
    <VerticalAccordion
      header={label}
      show={show}
      onToggleAccordion={onToggleAccordion}
      headerClassName={styles.verticalAccordionHeader}
      className={styles.accordion}
      childrenClassName={styles.accordionChildren}
      arrowClassName={styles.accordionArrow}
      activeArrowClassName={styles.activeAccordionArrow}>
      {children}
    </VerticalAccordion>
  );
};

export default TrezorPageAccordion;
