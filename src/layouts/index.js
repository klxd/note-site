import React from 'react'
import Link from 'gatsby-link'
import {Container} from 'react-responsive-grid'
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
    const {location, children} = this.props;
    let headerText = 'Note Site';
    let isMainPage = location.pathname === '/' || location.pathname === '/note-site/';
    let header = (
      <h1 style={isMainPage ? {fontSize: '40px'} : {fontSize: '20px'}}>
        <Link style={{boxShadow: 'none', textDecoration: 'none', color: 'inherit',}} to={'/'}>
          {headerText}
        </Link>
      </h1>
    );
    return (
      <div>
        <Shelter/>
        <div className='common-container'>
          {children()}
        </div>
        <GoTop/>
      </div>
    )
  }
}

Template.propTypes = {
  children: React.PropTypes.func,
  location: React.PropTypes.object,
  route: React.PropTypes.object,
};

export default Template
