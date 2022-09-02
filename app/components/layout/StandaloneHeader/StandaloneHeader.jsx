import { TitleHeader } from "../TitleHeader";
import DescriptionHeader from "../DescriptionHeader";
import styles from "./StandaloneHeader.module.css";

const StandaloneHeader = ({
  title,
  description,
  iconType,
  actionButton,
  docUrl
}) => (
  <div className={styles.header}>
    <TitleHeader
      title={title}
      iconType={iconType}
      optionalButton={actionButton}
      docUrl={docUrl}
    />
    <DescriptionHeader description={description} />
  </div>
);

export default StandaloneHeader;
