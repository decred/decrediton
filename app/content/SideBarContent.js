import React from 'react';
import MaterialTitlePanel from '../components/MaterialTitlePanel';
import { Link } from 'react-router';

const styles = {
  sidebar: {
    width: 256,
    height: '100%',
  },
  sidebarLink: {
    display: 'block',
    padding: '16px 0px',
    color: '#757575',
    textDecoration: 'none',
  },
  sidebarLinkCurrentPage: {
    display: 'block',
    padding: '16px 0px',
    color: 'white',
    textDecoration: 'bold',
  },
  divider: {
    margin: '8px 0',
    height: 1,
    backgroundColor: '#757575',
  },
  content: {
    padding: '16px',
    height: '100%',
    backgroundColor: '#2ed8a3',
  },
};

const SidebarContent = (props) => {
  const style = props.style ? {...styles.sidebar, ...props.style} : styles.sidebar;
  const { page } = props;

  const loggedIn = ( 
    <MaterialTitlePanel title="Menu" style={style}>
      <div style={styles.content}>
        <div style={styles.divider} />
        {page !== 'HOME' && <Link to="/" style={styles.sidebarLink}>Home</Link>}
        {page === 'HOME' && <span style={styles.sidebarLinkCurrentPage}>Home</span>}
        {page !== 'HISTORY' && <Link to="/history" style={styles.sidebarLink}>Transaction History</Link>}
        {page === 'HISTORY' && <span style={styles.sidebarLinkCurrentPage}>Transaction History</span>}
        {page !== 'SEND' && <Link to="/send" style={styles.sidebarLink}>Send Decred</Link>}
        {page === 'SEND' && <span style={styles.sidebarLinkCurrentPage}>Send Decred</span>}
        {page !== 'RECEIVE' && <Link to="/receive" style={styles.sidebarLink}>Receive Decred</Link>}
        {page === 'RECEIVE' && <span style={styles.sidebarLinkCurrentPage}>Receive Decred</span>}
        <div style={styles.divider} />
        <p>maybe decred balance stats down here?</p>
      </div>
    </MaterialTitlePanel>);

  const notLoggedIn = (
    <MaterialTitlePanel style={style}>
      <div style={styles.content}>
        <div style={styles.divider} />
        <span style={styles.sidebarLinkCurrentPage}>Get started</span>
        <div style={styles.divider} />
        <p>maybe decred getting started info stats down here?</p>
      </div>
    </MaterialTitlePanel>);

  if (props.loggedIn) {
    return (
      loggedIn
    );
  } else {
    return (
      notLoggedIn
    );
  }
};

SidebarContent.propTypes = {
  style: React.PropTypes.object,
  loggedIn: React.PropTypes.bool,
  page: React.PropTypes.string,
};

export default SidebarContent;