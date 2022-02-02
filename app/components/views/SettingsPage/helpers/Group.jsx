const Group = ({ className, children }) => (
  <div className={className}>{children}</div>
);

Group.propTypes = {
  children: PropTypes.node.isRequired
};

export default Group;
