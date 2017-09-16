import React from 'react'
import Link from 'gatsby-link'
import {Container} from 'react-responsive-grid'
import {rhythm, scale} from '../utils/typography'

require('../css/prism.css');

class Template extends React.Component {
  render() {
    const {location, children} = this.props;
    let headerText = 'Note Site';
    /**
     * {...scale(1.5), marginBottom: rhythm(1.5), marginTop: 0,}
     : {fontFamily: 'Montserrat, sans-serif', marginTop: 0, marginBottom: rhythm(-1),}
     */

    let header = (
      <h1 style={location.pathname === '/' ?
        {fontSize: '40px', marginTop: 0} :
        {fontSize: '20px', marginTop: 0}}>
        <Link style={{boxShadow: 'none', textDecoration: 'none', color: 'inherit',}} to={'/'}>
          {headerText}
        </Link>
      </h1>
    );
    return (
      <Container
        style={{
          maxWidth: '36rem',
          padding: '2rem 1.6rem',
        }}
      >
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
