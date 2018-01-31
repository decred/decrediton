import { TabbedComponent } from "shared";

const wrapperComponent = props => <div className="tab-content" { ...props } />;

const TabbedPage = ({...props}) => (
  <TabbedComponent className={"tabbed-page"} {...{wrapperComponent, ...props}}/>
);

TabbedPage.propTypes = { location: PropTypes.object.isRequired };

export default TabbedPage;
