// @flow
import React from 'react';
import SlateGrayButton from '../SlateGrayButton';
import KeyBlueButton from '../KeyBlueButton';
import Radium from 'radium';
import Balance from '../Balance';
import ArrowRightGray from '../icons/arrow-right-gray.svg';
import ArrowRightKeyBlue from '../icons/arrow-right-key-blue.svg';
import ArrowDownMidBlue from '../icons/arrow-down-mid-blue.svg';
import ArrowDownKeyBlue from '../icons/arrow-down-key-blue.svg';
import RenameIcon from '../icons/account-rename.svg';
import HideIcon from '../icons/account-eye-hide.svg';
import ShowIcon from '../icons/account-eye-open.svg';
import '../fonts.css';
import { AccountStyles } from '../views/ViewStyles.js';
import WalletGray from '../icons/wallet-gray.svg';

const styles = {
  accountRow: {
    position: 'relative',
    overflow: 'hidden',
    height: '77px',
    borderTop: '1px solid #F0F4F4',
    backgroundColor: '#FFF',
    backgroundImage: `url(${ArrowRightGray})`,
    backgroundPosition: '60px 24px',
    backgroundSize: '5px auto',
    backgroundRepeat: 'no-repeat',
    ':hover': {
      backgroundColor: 'rgba(212, 240, 253, .5)',
      backgroundImage: `url(${ArrowRightKeyBlue})`,
      backgroundSize: '5px',
    },
    cursor: 'pointer',
  },
  accountRowHidden: {
    position: 'relative',
    overflow: 'hidden',
    height: '77px',
    borderTop: '1px solid #F0F4F4',
    backgroundColor: 'transparent',
    backgroundImage: `url(${ArrowRightGray})`,
    backgroundPosition: '60px 24px',
    backgroundSize: '5px auto',
    backgroundRepeat: 'no-repeat',
    ':hover': {
      backgroundColor: 'rgba(212, 240, 253, .5)',
      backgroundImage: `url(${ArrowRightKeyBlue})`,
      backgroundSize: '5px',
    },
    cursor: 'pointer',
  },
  accountRowTopTop: {
    width: '100%',
    height: '40px',
    paddingLeft: '80px',
    float: 'left',
  },
  accountRowTopBottom: {
    width: '100%',
    height: '37px',
    paddingLeft: '80px',
    float: 'left',
    fontSize: '12px',
  },
  accountRowTopLastTx: {
    display: 'inline-block',
    height: '100%',
    paddingTop: '4px',
    color: '#132F4B',
  },
  accountRowTopSpendable: {
    width: 'auto',
    height: '100%',
    float: 'right',
    paddingRight: '100px',
  },
  accountRowWalletIcon: {
    position: 'absolute',
    left: '0px',
    bottom: '0px',
    width: '50px',
    height: '77px',
    marginRight: '30px',
    float: 'left',
    backgroundImage: `url(${WalletGray})`,
    backgroundPosition: '50% 20px',
    backgroundSize: '20px auto',
    backgroundRepeat: 'no-repeat',
  },
  accountRowTopAccountName: {
    height: '100%',
    paddingTop: '19px',
    float: 'left',
    color: '#0C1E3E',
    fontSize: '19px',
  },
  accountRowTopAccountFunds: {
    paddingTop: '18px',
    paddingRight: '100px',
    float: 'right',
    fontFamily: 'Inconsolata,monospace',
    color: '#0C1E3E',
    fontSize: '20px',
    fontWeight: '700',
  },
  accountRowDetailsTop: {
    position: 'relative',
    zIndex: '0',
    width: '100%',
    height: '77px',
    minWidth: '100px',
    paddingRight: '20px',
    float: 'left',
    backgroundColor: 'transparent',
    backgroundImage: `url(${ArrowDownMidBlue})`,
    backgroundPosition: '57px 26px',
    backgroundSize: '10px auto',
    backgroundRepeat: 'no-repeat',
    ':hover': {
      backgroundImage: `url(${ArrowDownKeyBlue})`,
      backgroundSize: '10px',
    },
    cursor: 'pointer',
    paddingTop: '1px',
  },
  accountRowDetailsBottomColumnLeft: {
    width: '300px',
    height: '200px',
    float: 'left',
    borderBottom: '1px solid #E7EAED',
  },
  accountRowDetailsBottomColumnRight: {
    width: '405px',
    marginRight: '20px',
    height: '200px',
    float: 'right',
    borderBottom: '1px solid #E7EAED',
  },
  accountRowDetailsBottom: {
    width: '100%',
    paddingRight: '20px',
    paddingLeft: '20px',
    float: 'left',
  },
  accountRowDetailsBottomTitle: {
    width: '100%',
    height: '30px',
    float: 'left',
    fontSize: '19px',
  },
  accountRowDetailsBottomTitleName: {
    width: '140px',
    height: '100%',
    paddingTop: '2px',
    paddingRight: '20px',
    float: 'left',
    color: '#596D81',
    textAlign: 'right',
  },
  accountRowDetailsBottomSpec: {
    width: '100%',
    height: 'auto',
    float: 'left',
    color: '#0C1E3E',
    fontSize: '12px',
  },
  accountRowDetailsBottomSpecLast: {
    paddingBottom: '9px',
    borderBottom: '1px solid #E7EAED',
    width: '100%',
    height: 'auto',
    float: 'left',
    color: '#0C1E3E',
    fontSize: '12px',
  },
  accountRowDetailsBottomSpecName: {
    width: '140px',
    height: '26px',
    paddingRight: '20px',
    float: 'left',
    textAlign: 'right',
  },
  accountRowDetailsBottomSpecValue: {
    height: '26px',
    float: 'left',
    fontDamily: 'Inconsolata,monospace',
    fontWeight: '700',
  },
  accountRowDetailsBottomRename: {
    width: '100%',
    height: '36px',
    float: 'left',
    color: '#0C1E3E',
    fontSize: '12px',
  },
  accountRowDetailsBottomRenameLast: {
    paddingBottom: '9px',
    borderBottom: '1px solid #E7EAED',
    width: '100%',
    height: '36px',
    float: 'left',
    color: '#0C1E3E',
    fontSize: '12px',
  },
  accountRowDetailsBottomRenameName: {
    width: '140px',
    height: '26px',
    paddingRight: '20px',
    paddingTop: '5px',
    float: 'left',
    textAlign: 'right',
  },
  accountRowDetailsCfg: {

  },
  accountRowLong: {
    height: '353px',
    marginTop: '1px',
    borderTop: '1px #A9B4BF solid',
    borderBottom: '1px #A9B4BF solid',
  },
  accountRowShort: {
    height: '77px',
  },
  accountRowShortHidden: {
    backgroundColor: 'transparent',
    height: '77px',
  },
  accountRowRename: {
    height: '248px',
    marginTop: '1px',
    borderTop: '1px #A9B4BF solid',
    borderBottom: '1px #A9B4BF solid',
  },
  contentConfirmNewAccount: {
    marginTop: '20px',
    marginLeft: '20px',
    float: 'left',
  },
  renameButton: {
    marginRight: '20px',
    marginTop: '15px',
    float: 'right',
    borderRadius: '0px',
    backgroundImage: `url(${RenameIcon})`,
    backgroundPosition: '50% 50%',
    backgroundSize: '40px',
    backgroundRepeat: 'no-repeat',
    boxShadow: 'none',
    outline: '0',
    position: 'relative',
    display: 'block',
    width: '40px',
    height: '40px',
    padding: '0px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '0',
    lineHeight: 'inherit',
    textDecoration: 'none',
    cursor: 'pointer',
    ':hover': {
      opacity: '0.7',
    },
  },
  showAccountButton: {
    marginRight: '20px',
    marginTop: '15px',
    float: 'right',
    borderRadius: '0px',
    backgroundImage: `url(${ShowIcon})`,
    backgroundPosition: '50% 50%',
    backgroundSize: '40px',
    backgroundRepeat: 'no-repeat',
    boxShadow: 'none',
    outline: '0',
    position: 'relative',
    display: 'block',
    width: '40px',
    height: '40px',
    padding: '0px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '0',
    lineHeight: 'inherit',
    textDecoration: 'none',
    cursor: 'pointer',
    ':hover': {
      opacity: '0.7',
    },
  },
  hideAccountButton: {
    marginRight: '20px',
    marginTop: '15px',
    float: 'right',
    borderRadius: '0px',
    backgroundImage: `url(${HideIcon})`,
    backgroundPosition: '50% 50%',
    backgroundSize: '40px',
    backgroundRepeat: 'no-repeat',
    boxShadow: 'none',
    outline: '0',
    position: 'relative',
    display: 'block',
    width: '40px',
    height: '40px',
    padding: '0px',
    backgroundColor: 'transparent',
    color: 'white',
    border: '0',
    lineHeight: 'inherit',
    textDecoration: 'none',
    cursor: 'pointer',
    ':hover': {
      opacity: '0.7',
    },
  },
};


const Row = ({
  account,
  hideAccountDetails,
  showAccountDetails,
  isShowingAccountDetails,
  isShowingRenameAccount,
  renameAccountName,
  renameAccountNameError,
  renameAccountNumber,
  hidden,
  updateRenameAccountName,
  renameAccount,
  showRenameAccount,
  hideRenameAccount,
  showAccount,
  hideAccount
}) => (
  <div
    style={
      isShowingAccountDetails
        ? isShowingRenameAccount
          ? styles.accountRowRename
          : styles.accountRowLong
        : styles.accountRowShort
    }
  >
    <div
      style={
        isShowingAccountDetails
          ? styles.accountRowDetailsTop
          : hidden
            ? styles.accountRowHidden
            : styles.accountRow
      }
      key={'top'+account.accountNumber}
      onClick={
        isShowingAccountDetails
          ? hideAccountDetails
          : () => showAccountDetails(account.accountNumber)
      }
    >
      <div style={styles.accountRowTopTop}>
        <div style={styles.accountRowWalletIcon}/>
        <div style={styles.accountRowTopAccountName}>{account.accountName}{
          hidden
            ? <span> (hidden)</span>
            : <span></span>
        }</div>
        <div style={styles.accountRowTopAccountFunds}><Balance amount={account.total}/></div>
      </div>
      <div style={styles.accountRowTopBottom}>
        <div style={styles.accountRowTopLastTx}></div>
        <div style={styles.accountRowTopSpendable}>Spendable <Balance amount={account.spendable}/></div>
      </div>
    </div>
    {!isShowingAccountDetails ? <div></div> :
      isShowingRenameAccount
        ? (
          <div style={styles.accountRowDetailsBottom} key={'details'+account.accountNumber}>
            <div style={styles.accountRowDetailsBottomTitle}>
              <div style={styles.accountRowDetailsBottomTitleName}>
                Rename Account
              </div>
            </div>
            <div style={styles.accountRowDetailsBottomRename}>
              <div style={styles.accountRowDetailsBottomRenameName}>New Account Name:</div>
              <div style={styles.accountRowDetailsBottomSpecValue}>
                <div style={AccountStyles.inputForm}>
                  <input
                    key={'rename'+account.accountNumber}
                    type="text"
                    style={AccountStyles.contentNestAddressHashTo}
                    placeholder="New Account Name"
                    maxLength="50"
                    onBlur={(e) =>updateRenameAccountName(e.target.value)}
                  />
                </div>
              </div>
              <div style={AccountStyles.accountFormInputError}>
                {renameAccountNameError}
              </div>
            </div>
            <KeyBlueButton
              style={styles.contentConfirmNewAccount}
              onClick={renameAccount}>
              Rename
            </KeyBlueButton>
            <SlateGrayButton
              style={styles.contentConfirmNewAccount}
              onClick={hideRenameAccount}>
              Cancel
            </SlateGrayButton>
          </div>
        )
       : (
         <div style={styles.accountRowDetailsBottom} key={'details'+account.accountNumber}>
           <div style={styles.accountRowDetailsBottomColumnLeft}>
             <div style={styles.accountRowDetailsBottomTitle}>
               <div style={styles.accountRowDetailsBottomTitleName}>
                 Balances
               </div>
             </div>
             <div style={styles.accountRowDetailsBottomSpec}>
               <div style={styles.accountRowDetailsBottomSpecName}>Total</div>
               <div style={styles.accountRowDetailsBottomSpecValue}><Balance amount={account.total}/></div>
             </div>
             <div style={styles.accountRowDetailsBottomSpec}>
               <div style={styles.accountRowDetailsBottomSpecName}>Spendable</div>
               <div style={styles.accountRowDetailsBottomSpecValue}><Balance amount={account.spendable}/></div>
             </div>
             <div style={styles.accountRowDetailsBottomSpec}>
               <div style={styles.accountRowDetailsBottomSpecName}>Immature Rewards</div>
               <div style={styles.accountRowDetailsBottomSpecValue}><Balance amount={account.immatureReward}/></div>
             </div>
             <div style={styles.accountRowDetailsBottomSpec}>
               <div style={styles.accountRowDetailsBottomSpecName}>Locked By Tickets</div>
               <div style={styles.accountRowDetailsBottomSpecValue}><Balance amount={account.lockedByTickets}/></div>
             </div>
             <div style={styles.accountRowDetailsBottomSpec}>
               <div style={styles.accountRowDetailsBottomSpecName}>Voting Authority</div>
               <div style={styles.accountRowDetailsBottomSpecValue}><Balance amount={account.votingAuthority}/></div>
             </div>
             <div style={styles.accountRowDetailsBottomSpec}>
               <div style={styles.accountRowDetailsBottomSpecName}>Immature Stake Generation</div>
               <div style={styles.accountRowDetailsBottomSpecValue}><Balance amount={account.immatureStakeGeneration}/></div>
             </div>
           </div>
           <div style={styles.accountRowDetailsBottomColumnRight}>
             <div style={styles.accountRowDetailsBottomTitle}>
               <div style={styles.accountRowDetailsBottomTitleName}>
                 Properties
               </div>
             </div>
             <div style={styles.accountRowDetailsBottomSpec}>
               <div style={styles.accountRowDetailsBottomSpecName}>Account number</div>
               <div style={styles.accountRowDetailsBottomSpecValue}>{account.accountNumber}</div>
             </div>
             <div style={styles.accountRowDetailsBottomSpec}>
               <div style={styles.accountRowDetailsBottomSpecName}>HD Path</div>
               <div style={styles.accountRowDetailsBottomSpecValue}>{account.HDPath}</div>
             </div>
             <div style={styles.accountRowDetailsBottomSpec}>
               <div style={styles.accountRowDetailsBottomSpecName}>Keys</div>
               <div style={styles.accountRowDetailsBottomSpecValue}>{account.externalKeys} external, {account.internalKeys} internal, {account.importedKeys} imported</div>
             </div>
           </div>
           {account.accountName !== 'imported' ?
             <div
               key={'renameAccountButton'+account.accountNumber}
               style={styles.renameButton}
               onClick={showRenameAccount}/>:
             <div></div>
           }
           {account.accountName !== 'imported' && account.accountName !== 'default' && account.total == 0 && !hidden ?
             <div
               key={'hideAccountButton'+account.accountNumber}
               style={styles.hideAccountButton}
               onClick={hideAccount}/>:
             account.accountName !== 'imported' && account.accountName !== 'default' && hidden ?
             <div
               style={styles.showAccountButton}
               key={'showAccountButton'+account.accountNumber}
               onClick={showAccount}/> :
             <div></div>
           }
         </div>
       )
    }
  </div>
);

export default Radium(Row);
