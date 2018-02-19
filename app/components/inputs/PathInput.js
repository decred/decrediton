
const PathInput = ({ onChange, value, placeholder }) =>
  <input
    type="text"
    className="path-input"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
  />;

export default PathInput;
