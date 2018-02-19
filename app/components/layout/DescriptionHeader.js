const DescriptionHeader = ({ description, actionButton }) =>
  <div className="description-header">
    <div className="description-header-action-button">
      {actionButton}
    </div>
    {description}
  </div>;

export default DescriptionHeader;
