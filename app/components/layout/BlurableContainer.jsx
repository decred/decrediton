import { classNames } from "pi-ui";
import { useModalVisible } from "./hooks";

const BlurableContainer = ({ className, children }) => {
  const { modalVisible } = useModalVisible();
  return (
    <div className={classNames(className, modalVisible && "blur")}>
      {children}
    </div>
  );
};

export default BlurableContainer;
