const TitleHeader = ({ title, iconClassName }) => (
  <Aux>
    <div className="title-header-icon">
      <div className={iconClassName} />
    </div>
    <div className="title-header-title">
      {title}
    </div>
  </Aux>
);

export default TitleHeader;
