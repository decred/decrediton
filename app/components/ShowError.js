import React, { Component, PropTypes } from 'react';

const styles = {
  error: {
    color:'red'
  },
};

class ShowError extends Component {
  constructor(props){
    super(props)
  }
  render() {
    const { error } = this.props;
    if (error === null) {
      return (<div></div>);
    } else {
      return (
        <div style={styles.error}>
          <p>{error}</p>
        </div>);
    }
  }  
}
export default ShowError;