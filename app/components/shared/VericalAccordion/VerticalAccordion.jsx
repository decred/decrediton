import { classNames } from "pi-ui";
import styles from "./VerticalAccordion.module.css";
import AnimatedContainer from "../AnimatedContainer";

const VerticalAccordion = ({
  show,
  children,
  onToggleAccordion,
  disabled,
  className,
  header,
  headerClassName,
  arrowClassName,
  activeArrowClassName,
  childrenClassName
}) => {
  return (
    <div
      className={classNames(
        styles.container,
        show && styles.active,
        className
      )}>
      <div
        className={classNames(styles.header, headerClassName)}
        onClick={!disabled ? () => onToggleAccordion?.() : null}>
        {header}
        <div
          className={classNames(
            disabled && "disabled",
            show && activeArrowClassName,
            styles.arrow,
            arrowClassName
          )}
        />
      </div>
      <AnimatedContainer {...{ children, childrenClassName, show }} />
    </div>
  );
};

export default VerticalAccordion;
