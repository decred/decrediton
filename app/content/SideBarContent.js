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
    backgroundColor: 'white',
  },
};

const SidebarContent = (props) => {
  const style = props.style ? {...styles.sidebar, ...props.style} : styles.sidebar;

  const links = [];

  for (let ind = 0; ind < 10; ind++) {
    links.push(
      <a key={ind} href="#" style={styles.sidebarLink}>Mock menu item {ind}</a>);
  }

  return (
    <MaterialTitlePanel title="Menu" style={style}>
      <div style={styles.content}>
        <Link to="/overview" style={styles.sidebarLink}>Overview</Link>
        <Link to="/send" style={styles.sidebarLink}>Send Decred</Link>
        <Link to="/receive" style={styles.sidebarLink}>Receive Decred</Link>
        <Link to="/history" style={styles.sidebarLink}>Transaction History</Link>
        <Link to="/stake" style={styles.sidebarLink}>Stake Information Page</Link>
        <div style={styles.divider} />
      </div>
    </MaterialTitlePanel>
  );
};

SidebarContent.propTypes = {
  style: React.PropTypes.object,
};

export default SidebarContent;