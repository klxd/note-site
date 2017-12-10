import React from 'react'
import Link from 'gatsby-link'
import kebabCase from "lodash/kebabCase"
import '../less/component/tag.less'

const linkStyle={
  textDecoration: 'none',
};

export default class Tag extends React.Component {
  render() {
    const name = this.props.name;
    const count = this.props.count || '';
    const linkTo = this.props.linkTo || `/tags/${kebabCase(name)}/`;
    return (
      <Link to={linkTo} className="tag-component">
        <span className="tag-name">{name}</span>
        {count && <span className="tag-count">{count}</span>}
      </Link>
    )
  }
}
Tag.propTypes = {
  name: React.PropTypes.string,
  count: React.PropTypes.number,
  linkTo: React.PropTypes.string,
};
