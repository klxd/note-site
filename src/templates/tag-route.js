import React from "react"
import PropTypes from 'prop-types'
import Link from "gatsby-link"
import Tag from '../components/Tag'
import '../less/template/tag-route.less'

class TagRoute extends React.Component {
  render() {
    const posts = this.props.data.allMarkdownRemark.edges
    const postLinks = posts.map((post, index) => (
      <li key={index} className="tag-list-item">
        <Link to={post.node.frontmatter.path}>{post.node.frontmatter.title}</Link>
      </li>
    ))

    return (
      <div className="tag-route-template">
        <div className="tag-header-panel">
          <Tag name={this.props.pathContext.tag} count={this.props.data.allMarkdownRemark.totalCount}/>
        </div>
        <ul className="tag-content-list">{postLinks}</ul>
        <p>
          <Link to="/tags/">查看全部标签</Link>
        </p>
      </div>
    )
  }
}

TagRoute.propTypes = {
  data: PropTypes.object,
  pathContext: PropTypes.object
}

export default TagRoute

export const pageQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            title
            path
          }
        }
      }
    }
  }
`