import React from 'react';
import MaterialTitlePanel from '../components/MaterialTitlePanel';
import { Link } from 'react-router';
import LoginForm from './LoginForm';

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
    backgroundColor: 'blue',
  },
};

const Login = (props) => {
  const loginProps = {
    logIn: props.logIn,
    isLoggedIn: props.isLoggedIn,
    setGrpcClient: props.setGrpcClient,
  }
  const style = props.style;

  return (
    <div>
      <LoginForm {...loginProps}/>
    </div>
  );
};

Login.propTypes = {
  style: React.PropTypes.object,
  isLoggedIn: React.PropTypes.bool,
  logIn: React.PropTypes.func,
  setGrpcClient: React.PropTypes.func,
  grpcClient: React.PropTypes.object,
};

export default Login;