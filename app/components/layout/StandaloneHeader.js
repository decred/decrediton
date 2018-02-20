import TitleHeader from "./TitleHeader";
import DescriptionHeader from "./DescriptionHeader";

const StandaloneHeader = ({ title, description, iconClassName, actionButton }) => {
  return (
    <div className="standalone-page-header">
      <TitleHeader title={title} iconClassName={iconClassName} />
      <DescriptionHeader description={description} actionButton={actionButton} />
    </div>
  );
};

export default StandaloneHeader;
