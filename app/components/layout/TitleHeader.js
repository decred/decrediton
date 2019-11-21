const TitleHeader = ({ title, iconClassName, optionalButton }) => (
  <div className="standalone-page-header-container is-row">
    <div className="is-row">
      <div className="title-header-icon">
        <div className={iconClassName} />
      </div>
      <div className="title-header-title">
        {title}
      </div>
    </div>
    { optionalButton &&
      <div className="title-header-button">
        {optionalButton}
      </div>
    }
  </div>
);

export default TitleHeader;
