import TutorialPage from "./Page";

@autobind
class Tutorial extends React.Component{
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      tutorialStep: 0
    };
  }

  render() {
    const { tutorialStep } = this.state;
    const { onNextTutorialStep, onPrevTutorialStep} = this;
    const { finishTutorial } = this.props;
    return (
      <TutorialPage
        {...{
          tutorialStep,
          onNextTutorialStep,
          onPrevTutorialStep,
          finishTutorial
        }
        }/>);
  }

  onNextTutorialStep() {
    const { tutorialStep } = this.state;
    if (tutorialStep + 1 <= 5) {
      this.setState({tutorialStep: tutorialStep + 1});
    }
  }

  onPrevTutorialStep() {
    const { tutorialStep } = this.state;
    if (tutorialStep - 1 >= 0) {
      this.setState({tutorialStep: tutorialStep - 1});
    }
  }

}

export default Tutorial;
