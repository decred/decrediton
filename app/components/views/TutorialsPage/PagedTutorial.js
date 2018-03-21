import { FormattedMessage as T } from "react-intl";
import { InvisibleButton } from "buttons";
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

  onGotoPage(pageIndex) {
    if (pageIndex > -1 && pageIndex < this.props.pages.length) {
      this.setState({ currentPageIndex: pageIndex });
    }
  }

  onGoBack() {
    this.props.goBackHistory();
  }

  onFinish() {
    this.onGoBack();
  }

  render() {
    const { title } = this.props;
    const CurrentPage = this.getCurrentPageComponent();
    const { onNextPage, onPreviousPage, onGoBack, onGotoPage, onFinish } = this;

    return (
      <Aux>
        <InvisibleButton className="tutorial-close-button" onClick={onGoBack} />
        <div className="tutorial-title">{title}</div>
        <div className="tutorial-subtitle">
          <T id="tutorial.subtitle" m="Tutorial" />
        </div>
        <div className="tutorial-page">
          <CurrentPage
            {...this.props}
            {...this.state}
            onNextPage={onNextPage}
            onPreviousPage={onPreviousPage}
            onGotoPage={onGotoPage}
            onFinish={onFinish}
          />
        </div>
      </Aux>
    );
  }
}

export default routing(PagedTutorial);
