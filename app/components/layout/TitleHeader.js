const TitleHeader = ({ title, iconClassName, optionalButton }) => (
  <div className="standalone-page-header-container">
    <div className="title-header-icon">
      <div className={iconClassName} />
    </div>
    <div className="title-header-title">
      {title}
    </div>
    {optionalButton &&
    <div className="title-header-button">
      {optionalButton}
    </div>
    }
  </div>
);

export default TitleHeader;
