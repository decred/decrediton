const TitleHeader = ({ title, iconClassName }) => (
  <Aux>
    <div className="title-header-title">
      {title}
    </div>

    <div className="title-header-icon">
      <div className={iconClassName} />
    </div>
  </Aux>
);

export default TitleHeader;
