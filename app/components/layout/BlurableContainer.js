import { modalVisible } from "connectors";

const BlurableContainer = ({ modalVisible, className, children }) =>
  <div className={[ className, modalVisible ? "blur" : "" ].join(" ")}>
    {children}
  </div>;

export default modalVisible(BlurableContainer);
