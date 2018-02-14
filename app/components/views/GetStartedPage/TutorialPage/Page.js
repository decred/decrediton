import { KeyBlueButton } from "buttons";
import "style/Tutorial.less";

const TutorialPage = ({tutorialStep, onNextTutorialStep, onPrevTutorialStep, finishTutorial}) => {
  return (
    <div className="tutorial">
      <div className="tutorial-side">
        <div className={"tutorial-side-image step-" + tutorialStep}>
        </div>
      </div>
      <div className="tutorial-main">
        <div className="tutorial-main-header">
          Tutorial Step: <span>{tutorialStep}</span>
        </div>
        <div className="tutorial-main-text">
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id augue dui. Cras in dui libero. Etiam eget nulla vel magna ullamcorper scelerisque in vitae ipsum. Curabitur at bibendum arcu, ac mollis ante. Integer ullamcorper porta faucibus. Aenean id ante id augue pharetra porta. Nulla eu leo eget velit molestie lacinia. Sed ultricies libero a arcu mattis, quis rutrum eros hendrerit. Integer eget risus in ex auctor dapibus. Phasellus efficitur semper nisi, non pharetra leo placerat vel.

Suspendisse sagittis turpis eu semper lobortis. Ut in pretium magna. Phasellus vulputate rutrum vehicula. Curabitur luctus euismod dapibus. Etiam tempus condimentum consequat. Nunc et nulla id tortor finibus porttitor. Sed dignissim cursus maximus. Morbi vitae sollicitudin quam, ut iaculis mi. Etiam sapien odio, vulputate id magna id, scelerisque porttitor ante. Mauris libero velit, laoreet vel sapien at, accumsan porttitor ipsum. Aenean id mi ipsum. Fusce quam risus, sodales eu dignissim a, cursus non dolor. In facilisis sem urna, a consectetur mi dignissim ut. Aenean id arcu varius, sagittis enim sed, cursus mauris. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam at diam elit.

Praesent at ante quis sem interdum congue. Nunc elementum porttitor elit, vitae efficitur nisi congue id. In libero nibh, lobortis non sem laoreet, imperdiet dictum nisi. Cras a arcu auctor lorem malesuada faucibus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Suspendisse condimentum dui tellus, vel malesuada odio tristique ut. Vivamus vel pharetra nisl. Aliquam sed malesuada libero.

Morbi tincidunt, magna id blandit porttitor, ex arcu dapibus orci, sed iaculis felis erat eu augue. Fusce at nibh eros. Suspendisse pulvinar lectus sed velit dictum, nec auctor nunc tincidunt. Phasellus aliquam ullamcorper erat et efficitur. Aliquam molestie lobortis tellus sit amet semper. Vestibulum pretium nulla vel lacus consectetur rhoncus. Sed sed lobortis quam, vitae euismod ante.

Curabitur mattis posuere ex id vulputate. Mauris bibendum ligula libero, nec vestibulum mi lobortis in. Aenean pulvinar, nisi ut pharetra sollicitudin, massa erat gravida est, ornare scelerisque lectus augue vulputate mi. Pellentesque lorem odio, vulputate ac eleifend eget, aliquam ac nisi. Curabitur nec leo libero. Proin posuere rutrum finibus. Sed auctor enim sed quam luctus, ac bibendum velit interdum. Suspendisse mollis leo a velit pellentesque, eget efficitur mauris auctor. Pellentesque ac venenatis nisi, a pulvinar purus. Aenean id quam eget lacus ultrices porttitor ut et ipsum. Nunc rhoncus est at est gravida cursus. Morbi id pellentesque risus, vitae tincidunt sapien. Aenean faucibus venenatis aliquam. Nulla sed risus ut velit bibendum elementum. Nam cursus dui sed gravida lacinia. 
        </div>
        <div className="tutorial-main-toolbar">
          <KeyBlueButton onClick={onPrevTutorialStep} >
            Previous
          </KeyBlueButton>
          <KeyBlueButton onClick={onNextTutorialStep} >
            Next
          </KeyBlueButton>
          <KeyBlueButton onClick={finishTutorial}>
            Finish
          </KeyBlueButton>
        </div>
      </div>
    </div>
  );
};
export default TutorialPage;
