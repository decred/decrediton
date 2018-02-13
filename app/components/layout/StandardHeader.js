import { tabbedHeader } from "connectors";

const StandardHeader = ({children}) => {
  return (
    <div className="header">
      <div className="tabbedheader-title">
      </div>

      <div className="tabbedheader-icon">
      </div>

      <div className="tabbedheader-content">
        <div>the description</div>
        {children}
      </div>
    </div>
  );
};

export default tabbedHeader(StandardHeader);
