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

  const loggedIn = ( 
    <div style={styles.content}>
      <div style={styles.divider} />
      <Link to="/history" style={styles.sidebarLink}>Transaction History</Link>
      <Link to="/send" style={styles.sidebarLink}>Send Decred</Link>
      <Link to="/receive" style={styles.sidebarLink}>Receive Decred</Link>
      <div style={styles.divider} />
      <p>maybe decred balance stats down here?</p>
    </div>);

  const notLoggedIn = (
    <div style={styles.content}>
      <div style={styles.divider} />
    </div>);
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
};

export default SidebarContent;