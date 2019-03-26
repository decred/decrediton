const TitleHeader = ({ title, iconClassName, optionalButton }) => (
  <>
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
  </>
);

export default TitleHeader;
