const TabbedPageTab = ({ children }) => children;

TabbedPageTab.propTypes = {
  path: PropTypes.string.isRequired,
  link: PropTypes.node.isRequired
};

export default TabbedPageTab;
