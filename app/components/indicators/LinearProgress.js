import "style/Loading.less";

const LinearProgress = ({ barText, value, min, max }) =>
  <div className="linear-progress">
    <div className="linear-progress-bar" style={{ width: `${(value/max-min)*100}` + "%" }}>
      <div className="linear-progress-box one"  style={{ left: `${(value/max-min)*877+10}` + "px" }}/>
      <div className="linear-progress-box two"  style={{ left: `${(value/max-min)*877+10}` + "px" }}/>
      <div className="linear-progress-box three"  style={{ left: `${(value/max-min)*877+10}` + "px" }}/>
      <div className="linear-progress-box four"  style={{ left: `${(value/max-min)*877+10}` + "px" }}/>
      <div className="linear-progress-box five" style={{ left: `${(value/max-min)*877+10}` + "px" }}/>
      <div className="linear-progress-box six"  style={{ left: `${(value/max-min)*877+10}` + "px" }}/>
      <div className="linear-progress-text">
        {barText}
      </div>
    </div>
  </div>;

export default LinearProgress;
