import ticketAutoBuyer from "connectors/ticketAutoBuyer";
import { substruct, compose, eq, get } from "fp";
import { injectIntl } from "react-intl";
import TicketAutoBuyerForm from "./Form";
import { DCR, UNIT_DIVISOR } from "constants";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useMountEffect } from "hooks";
import { usePurchaseTab } from "../hooks";
import * as ca from "actions/ControlActions.js"

function TicketAutoBuyer({ intl }) {
  const { availableVSPs, onEnableTicketAutoBuyer } = usePurchaseTab();
  const [balanceToMaintain, setBalanceToMaintain] = useState(null)
  const [account, setAccount] = useState(null);
  const [vsp, setVSP] = useState(null);

  return (
    <TicketAutoBuyerForm
      {...{
        formatMessage: intl.formatMessage,
        onChangeBalanceToMaintain: setBalanceToMaintain,
        changeAccount: setAccount,
        changeVSP: setVSP,
        account,
        vsp,
        onEnableTicketAutoBuyer,
        availableVSPs
      }}
    />
  );
}

export default injectIntl(TicketAutoBuyer);
// @autobind
// class TicketAutoBuyer extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = this.getInitialState();
//   }

//   }

//   componentDidUpdate() {
//     const { isHidingDetails } = this.state;
//     if (!isHidingDetails) {
//       this.scrollToBottom();
//     }
//   }

//   render() {
//     const changeBalanceToMaintain = (e) => this.onChangeBalanceToMaintain(e);
//     const changeAccount = (e) => this.onChangeAccount(e);
//     const changeStakePool = (e) => this.onChangeStakePool(e);
//     return (
//       <TicketAutoBuyerForm
//         {...{
//           isTicketAutoBuyerConfigDirty: this.getIsDirty(),
//           formatMessage: this.props.intl.formatMessage,
//           onChangeBalanceToMaintain: changeBalanceToMaintain,
//           changeAccount,
//           changeStakePool,
//           account: this.getAccount(),
//           stakePool: this.getStakePool(),
//           ...this.props,
//           ...this.state,
//           ...substruct(
//             {
//               onStartAutoBuyer: null
//             },
//             this
//           )
//         }}
//       />
//     );
//   }

//   getCurrentSettings() {
//     return substruct(
//       {
//         balanceToMaintain: null
//       },
//       this.props
//     );
//   }

//   onChangeAccount(account) {
//     this.setState({ account });
//   }

//   getIsDirty() {
//     const settings = this.getCurrentSettings();
//     return !!Object.keys(settings).find(
//       (key) => this.state[key] !== settings[key]
//     );
//   }

//   onStartAutoBuyer(passphrase) {
//     const { onEnableTicketAutoBuyer } = this.props;
//     onEnableTicketAutoBuyer &&
//       onEnableTicketAutoBuyer(
//         passphrase,
//         this.getAccount(),
//         this.state.balanceToMaintain,
//         this.getStakePool()
//       );
//   }

//   getErrors() {
//     const { balanceToMaintainError } = this.state;

//     if (balanceToMaintainError) {
//       this.setState({
//         canNotEnableAutobuyer: true
//       });
//       return true;
//     }

//     this.setState({
//       canNotEnableAutobuyer: false
//     });
//     return false;
//   }
// }

// export default ticketAutoBuyer(injectIntl(TicketAutoBuyer));
