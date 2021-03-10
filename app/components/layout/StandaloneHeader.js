import { TitleHeader } from "./TitleHeader";
import DescriptionHeader from "./DescriptionHeader";

const StandaloneHeader = ({
  title,
  description,
  iconType,
  actionButton
}) => {
  return (
    <div className="standalone-page-header">
      <TitleHeader
        title={title}
        iconType={iconType}
        optionalButton={actionButton}
      />
      <DescriptionHeader description={description} />
    </div>
  );
};

export default StandaloneHeader;
