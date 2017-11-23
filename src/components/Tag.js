import React from 'react'
import Link from 'gatsby-link'
import kebabCase from "lodash/kebabCase"

const linkStyle={
  textDecoration: 'none',
};

export default class Tag extends React.Component {
  render() {
    const name = this.props.name;
    return (
      <Link to={`/tags/${kebabCase(name)}/`}
            style={linkStyle}>
        <span className="tag">{name}</span>
      </Link>
    )
  }
}
Tag.propTypes = {
  name: React.PropTypes.string,
};
