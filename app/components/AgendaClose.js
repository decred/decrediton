// @flow
import React from "react";
import "../style/AgendaCard.less";

class AgendaClose extends React.Component {
  render() {
    return (
      <a className="agenda-overview-title-close" onClick={this.props.onClick}></a>
    );

  }
}

export default AgendaClose;
