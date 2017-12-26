import React from "react"
import PropTypes from "prop-types"
import Helmet from "react-helmet"
import get from "lodash/get"
import Tag from "../components/Tag"
import "../less/template/blog-post.less"

/**
 * this class will render all the blog MD files into html
 */
class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, "data.site.siteMetadata.title")
    return (
      <div className="blog-post-template">
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`} />
        <div className="header-line">
          <div className="header-text">{post.frontmatter.title}</div>
          <div className="header-date">{post.frontmatter.date}</div>
        </div>
        <div className="post-tags">
          {post.frontmatter.tags.map((tag, index) => (
            <Tag key={index} name={tag} />
          ))}
        </div>
        <div
          dangerouslySetInnerHTML={{__html: post.tableOfContents}}
          className="content-link-table"
        />
        <div dangerouslySetInnerHTML={{__html: post.html}} />
        <hr />
      </div>
    )
  }
}

BlogPostTemplate.propTypes = {
  data: PropTypes.object,
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(frontmatter: {path: {eq: $path}}) {
      id
      html
      tableOfContents
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
      }
    }
  }
`
