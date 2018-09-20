import TitleHeader from "./TitleHeader";
import DescriptionHeader from "./DescriptionHeader";

const StandaloneHeader = ({ title, description, iconClassName, actionButton }) => {
  return (
    <div className="standalone-page-header">
      <TitleHeader title={title} iconClassName={iconClassName}optionalButton={actionButton} />
      <DescriptionHeader description={description} />
    </div>
  );
};

export default StandaloneHeader;
