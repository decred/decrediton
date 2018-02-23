import "style/Loading.less";

const LinearProgressSmall = ({ value, min, max }) =>
  <div className="linear-progress small">
    <div className="linear-progress-bar" style={{ width: `${(value/max-min)*100}` + "%" }}>
    </div>
  </div>;

export default LinearProgressSmall;
