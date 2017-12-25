import React from "react"
import PropTypes from 'prop-types'
import Link from "gatsby-link"
import kebabCase from "lodash/kebabCase"
import "../less/page/tags-page.less"

/**
 * class for showing all the tags (with count)
 */
class TagsPageRoute extends React.Component {
  render() {
    const allTags = this.props.data.allMarkdownRemark.group
    return (
      <div className="tags-page">
        <h3>所有标签</h3>
        <ul>
          {allTags.map(tag => (
            <li key={tag.fieldValue}>
              <Link
                style={{
                  textDecoration: `none`,
                }}
                to={`/tags/${kebabCase(tag.fieldValue)}/`}
              >
                {tag.fieldValue} ({tag.totalCount})
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

TagsPageRoute.propTypes = {
  data: PropTypes.object,
};

export default TagsPageRoute

export const pageQuery = graphql`
  query TagsQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`