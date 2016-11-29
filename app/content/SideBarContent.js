import React from 'react';
import MaterialTitlePanel from '../components/MaterialTitlePanel';
import { Link } from 'react-router';
import LoginForm from '../containers/LoginForm';

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

  return (
    <MaterialTitlePanel title="Menu" style={style}>
      <div style={styles.content}>
        <Link to="/history" style={styles.sidebarLink}>Transaction History</Link>
        <div style={styles.divider} />
      </div>
    </MaterialTitlePanel>
  );
};

SidebarContent.propTypes = {
  style: React.PropTypes.object,
};

export default SidebarContent;