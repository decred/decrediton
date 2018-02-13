import "style/StakePool.less";

const NetworkSwitch = ({ enabled, onClick }) => (
  <div className="autobuyer-switch">
    <div className={enabled ? "autobuyer-switch-enabled" : "autobuyer-switch-disabled"} onClick={onClick}>
      <div className={enabled ? "autobuyer-switch-knob-enabled" : "autobuyer-switch-knob-disabled"}></div>
    </div>
  </div>
);

export default NetworkSwitch;
