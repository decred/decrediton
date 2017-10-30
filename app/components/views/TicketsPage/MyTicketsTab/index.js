import React, {Component} from "react";
import myTickets from "connectors/myTickets";
import "style/MyTickets.less";

class MyTickets extends Component{/*  */

  render() {
    const { children } = this.props;
    return (
      <div className="tab-card">
        {children}
      </div>
    );
  }
}

export default myTickets(MyTickets);
