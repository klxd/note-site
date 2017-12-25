import React from 'react'
import PropTypes from 'prop-types'
import Shelter from "../components/Shelter";
import GoTop from "../components/GoTop";

import '../less/prism.css';
import '../less/common.less';


/**
 * the render function of this class will run in front side,
 * it define the header & content of each page
 */
class Template extends React.Component {
  render() {
    return (
      <div>
        <Shelter/>
        <div className='common-container'>
          {this.props.children()}
        </div>
        <GoTop/>
      </div>
    )
  }
}

Template.propTypes = {
  children: PropTypes.func,
  location: PropTypes.object,
  route: PropTypes.object,
};

export default Template
