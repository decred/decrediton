import {
  TutorialOverview,
  tutorials
} from "../../SettingsPage/TutorialsTab/helpers";
import { Subtitle } from "shared";
import { FormattedMessage as T } from "react-intl";
import styles from "./LoadingPage.module.css";

const LoadingPage = ({ onShowOnboardingTutorial }) => {
  return (
    <div className={styles.container}>
      <Subtitle
        className={styles.subtitle}
        title={
          <T
            id="getstarted.loadingpage.learnAboutDecred"
            m="Learn about decred"
          />
        }
      />
      {[
        "decredIntro",
        "ln",
        "consensusCode",
        "powPos",
        "tickets",
        "staking",
        "lifecycle",
        "consensusVoting",
        "blocks",
        "identity"
      ].map((name) => (
        <TutorialOverview
          {...{
            key: name,
            name,
            tutorials,
            viewTutorialHandler: onShowOnboardingTutorial,
            showProgressBar: false
          }}
        />
      ))}
    </div>
  );
};

export default LoadingPage;
