import {
  FetchBlockHeadersFormHeader as FetchBlockHeadersHeader,
  FetchBlockHeadersFormBody
} from "./Form";

class FetchBlockHeadersBody extends React.Component {

  constructor(props)  {
    super(props);
    this.state = this.getInitialState();
  }

  componentWillUnmount() {
    this.mounted = false;
    this.resetState();
    if(this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  getInitialState() {
    return {
      showLongWaitMessage: false
    };
  }

  render() {
    const { showLongWaitMessage } = this.state;

    return (
      <FetchBlockHeadersFormBody
        {...{
          ...this.props,
          showLongWaitMessage
        }}
      />
    );
  }

  componentDidMount() {
    this.mounted = true;
    this.timeoutId = setTimeout(() => {
      if(this.mounted) {
        this.setState({ showLongWaitMessage: true });
      }
      delete this.timeoutId;
    }, 2000);
  }

  resetState() {
    this.setState(this.getInitialState());
  }

}

export { FetchBlockHeadersHeader, FetchBlockHeadersBody };
