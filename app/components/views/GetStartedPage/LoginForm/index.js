import React, { Component } from "react";
import { autobind } from "core-decorators";
import { substruct } from "fp";
import ReactTimeout from "react-timeout";
import { LoginRPCHeader, LoginRPCBody } from "./Form";

@autobind
class LoginFormBody extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      isSubmited: false,
      rpcuserFilled: false,
      rpcpasswordFilled: false,
      rpccertFilled: false,
      rpcappdataFilled: false,
    };
  }

  render() {
    return (
      <LoginRPCBody
        {...{
          ...this.props,
          ...this.state,
          ...substruct({
            onSubmit: null,                      
            onChangeRpcuser: null,
            onChangeRpcpass: null,
            onChangeRpccert: null,
            onChangeRpcappdata: null,
          }, this)
        }}
      />
    );
  }

  getIsValid() {
    const { rpcuserFilled, rpcpasswordFilled, rpccertFilled, rpcappdataFilled } = this.state;

    console.log(rpcuserFilled)
    console.log(rpcpasswordFilled)
    console.log(rpcuserFilled)
    console.log(rpcappdataFilled)

    if (!rpcuserFilled || !rpcpasswordFilled || !rpccertFilled || !rpcappdataFilled)
      return false;
    return true;
  }

  onChangeRpcuser(rpcuser) {
    if (!rpcuser)
      return this.setState({ rpcuserFilled: false });
    this.setState({ rpcuserFilled: true });
  }

  onChangeRpcpass(rpcpass) {
    if (!rpcpass)
      return this.setState({ rpcpasswordFilled: false });
    this.setState({ rpcpasswordFilled: true });
  }

  onChangeRpccert(rpccert) {
    if (!rpccert)
      return this.setState({ rpccertFilled: false });
    this.setState({ rpccertFilled: true });
  }

  onChangeRpcappdata(rpcappdata) {
    if (!rpcappdata)
      return this.setState({ rpcappdataFilled: false });
    this.setState({ rpcappdataFilled: true });
  }

  onSubmit(args) {
    if (this.getIsValid())
      this.props.doStartAdvancedDaemon(args);
  }

}

export { LoginRPCHeader, LoginFormBody };
