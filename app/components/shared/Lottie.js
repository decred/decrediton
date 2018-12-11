import lottie_light from "lottie-web/build/player/lottie_light";

@autobind
class Lottie extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.anim = lottie_light.loadAnimation({
      container: this.el, // the dom element
      renderer: "svg",
      loop: this.props.loop,
      autoplay: this.props.autoplay,
      animationData: this.props.animationData, // the animation data
      rendererSettings: {
        scaleMode: "noScale",
        clearCanvas: false,
        progressiveLoad: false, // Boolean, only svg renderer, loads dom elements when needed. Might speed up initialization for large number of elements.
        hideOnTransparent: true, //Boolean, only svg renderer, hides elements when opacity reaches 0 (defaults to true)
      }
    });

    if (!this.props.autoplay && !this.props.paused && !this.props.stopped) {
      this.anim.play();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.paused !== this.props.paused) {
      if (this.props.paused) {
        this.anim.pause();
      } else {
        this.anim.play();
      }
    }

    if (prevProps.stopped !== this.props.stopped) {
      if (this.props.stopped) {
        this.anim.stop();
      } else {
        this.anim.play();
      }
    }
  }

  render() {
    return <div
      className={this.props.className}
      ref={c => this.el = c}
    />;
  }
}

Lottie.propTypes = {
  className: PropTypes.string,
  animationData: PropTypes.Object,
  loop: PropTypes.bool.isRequired,
  autoplay: PropTypes.bool.isRequired,
  paused: PropTypes.bool.isRequired,
  stopped: PropTypes.bool.isRequired,
};

Lottie.defaultProps = {
  loop: true,
  autoplay: true,
  paused: false,
  stopped: false,
};

export default Lottie;
