import { classNames } from "pi-ui";
import { useModalVisible } from "./hooks";
import styles from "./BlurableContainer.module.css";

const BlurableContainer = ({ className, children }) => {
  const { modalVisible } = useModalVisible();
  return (
    <div className={classNames(className, modalVisible && styles.blur)}>
      {children}
    </div>
  );
};

export default BlurableContainer;
