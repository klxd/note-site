import React from "react"
import Link from "gatsby-link"

class TagRoute extends React.Component {
  render() {
    const posts = this.props.data.allMarkdownRemark.edges
    const postLinks = posts.map((post, index) => (
      <li key={index}>
        <Link to={post.node.frontmatter.path}>{post.node.frontmatter.title}</Link>
      </li>
    ))

    return (
      <div>
        <h1>
          {this.props.data.allMarkdownRemark.totalCount}
          {` `}posts tagged with “{this.props.pathContext.tag}”
        </h1>
        <ul>{postLinks}</ul>
        <p>
          <Link to="/tags/">Browse all tags</Link>
        </p>
      </div>
    )
  }
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