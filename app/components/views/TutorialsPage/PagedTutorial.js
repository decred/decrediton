import { FormattedMessage as T } from "react-intl";
import { routing } from "connectors";

@autobind
class PagedTutorial extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentPageIndex: 0, pageCount: props.pages.length };
  }

  getCurrentPageComponent() {
    return this.props.pages[this.state.currentPageIndex];
  }

  onNextPage() {
    if (this.state.currentPageIndex < this.props.pages.length-1) {
      this.setState({ currentPageIndex: this.state.currentPageIndex + 1 });
    }
  }

  onPreviousPage() {
    if (this.state.currentPageIndex > 0) {
      this.setState({ currentPageIndex: this.state.currentPageIndex - 1 });
    }
  }

  onGoBack() {
    this.props.goBackHistory();
  }

  render() {
    const { title } = this.props;
    const CurrentPage = this.getCurrentPageComponent();
    const { onNextPage, onPreviousPage, onGoBack } = this;

    return (
      <Aux>
        <div className="tutorial-title">{title}</div>
        <div className="tutorial-subtitle">
          <T id="tutorial.subtitle" m="Tutorial" />
        </div>
        <div className="tutorial-close-button" onClick={onGoBack}>X</div>
        <div className="tutorial-page">
          <CurrentPage
            {...this.props}
            {...this.state}
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
          />
        </div>
      </Aux>
    );
  }
}

export default routing(PagedTutorial);
