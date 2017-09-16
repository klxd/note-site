import React from 'react'
import Link from 'gatsby-link'
import {Container} from 'react-responsive-grid'

require('../css/prism.css');
require('../css/entry.css');

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
      <Container style={{maxWidth: '36rem', padding: '2rem 1.6rem',}}>
        {header}
        {children()}
      </Container>
    )
  }
}

Template.propTypes = {
  children: React.PropTypes.func,
  location: React.PropTypes.object,
  route: React.PropTypes.object,
};

export default Template
