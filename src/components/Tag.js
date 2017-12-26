import React from "react"
import PropTypes from "prop-types"
import Link from "gatsby-link"
import kebabCase from "lodash/kebabCase"
import "../less/component/tag.less"

export default class Tag extends React.Component {
  render() {
    const name = this.props.name
    const count = this.props.count || ""
    const linkTo = this.props.linkTo || `/tags/${kebabCase(name)}/`
    return (
      <Link to={linkTo} className="tag-component">
        <span className="tag-name">{name}</span>
        {count && <span className="tag-count">{count}</span>}
      </Link>
    )
  }
}
Tag.propTypes = {
  name: PropTypes.string,
  count: PropTypes.number,
  linkTo: PropTypes.string,
}
