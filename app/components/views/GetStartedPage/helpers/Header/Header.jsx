import styles from "./Header.module.css";
import ContentContainer from "../ContentContainer";
import { SlateGrayButton } from "buttons";
import { LearnBasicsMsg, WhatsNewLink, LoaderTitleMsg } from "../../messages";

const Header = ({ appVersion, onShowTutorial, onShowReleaseNotes }) => (
  <>
    <ContentContainer>
      <LoaderTitleMsg />
    </ContentContainer>
    <div className={styles.loaderButtons}>
      <SlateGrayButton
        onClick={onShowTutorial}
        className={styles.tutorialButton}>
        <LearnBasicsMsg />
      </SlateGrayButton>
      <WhatsNewLink {...{ onShowReleaseNotes, appVersion }} />
    </div>
  </>
);
export default Header;
