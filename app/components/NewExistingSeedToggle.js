// @flow
import Radium from "radium";
import React from "react";

const styles = {
  textToggle: {
    display: "block",
    height: "44px",
    float: "right",
    textAlign: "left",
  },

  textToggleButtonLeft: {
    minWidth: "140px",
    float: "left",
    border: "1px #e7eaed solid",
    borderRadius: "5px 0px 0px 5px",
    backgroundColor: "#fff",
    boxShadow: "none",
    color: "#8997a5",
    display: "inline-block",
    padding: "12px 18px",
    fontSize: "13px",
    fontWeight: "600",
    textAlign: "center",
    textDecoration: "none",
    textTransform: "capitalize",
    cursor: "pointer",
  },

  textToggleButtonRight: {
    minWidth: "140px",
    float: "left",
    border: "1px #e7eaed solid",
    borderRadius: "0px 5px 5px 0px",
    backgroundColor: "#fff",
    boxShadow: "none",
    color: "#8997a5",
    display: "inline-block",
    padding: "12px 18px",
    fontSize: "13px",
    fontWeight: "600",
    textAlign: "center",
    textDecoration: "none",
    textTransform: "capitalize",
    cursor: "pointer",
  },

  textToggleButtonActiveLeft: {
    backgroundColor: "#f3f6f6",
    color: "#0c1e3e",
    cursor: "default",
    minWidth: "140px",
    float: "left",
    border: "1px solid #f3f6f6",
    borderRadius: "5px 0px 0px 5px",
    boxShadow: "none",
    display: "inline-block",
    padding: "12px 18px",
    fontSize: "13px",
    fontWeight: "600",
    textAlign: "center",
    textDecoration: "none",
    textTransform: "capitalize",
  },
  textToggleButtonActiveRight: {
    backgroundColor: "#f3f6f6",
    color: "#0c1e3e",
    cursor: "default",
    minWidth: "140px",
    float: "left",
    border: "1px solid #f3f6f6",
    borderRadius: "0px 5px 5px 0px",
    boxShadow: "none",
    display: "inline-block",
    padding: "12px 18px",
    fontSize: "13px",
    fontWeight: "600",
    textAlign: "center",
    textDecoration: "none",
    textTransform: "capitalize",
  },
  textToggleButtonDescription: {
    width: "100%",
    height: "100%",
    textTransform: "capitalize",
    display: "block",
    paddingTop: "12px",
    paddingRight: "35px",
    paddingLeft: "35px",
      //textAlign: 'left',
  }
};
class NewExistingSeedToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeButton: this.props.activeButton,
    };
  }
  clickButton(side) {
    this.setState({activeButton:side});
    this.props.toggleAction(side);
  }
  render() {
    const { leftText, rightText } = this.props;
    return (
      <div style={styles.textToggle}>
        <div style={this.state.activeButton == "right" ? styles.textToggleButtonLeft : styles.textToggleButtonActiveLeft } onClick={this.state.activeButton == "right" ? () => this.clickButton("left") : null}>
          {leftText}
        </div>
        <div style={this.state.activeButton == "left" ? styles.textToggleButtonRight : styles.textToggleButtonActiveRight } onClick={this.state.activeButton == "left" ? () => this.clickButton("right") : null}>
          {rightText}
        </div>
      </div>
    );
  }
}
export default Radium(NewExistingSeedToggle);
