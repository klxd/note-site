import React from 'react'
import Helmet from 'react-helmet'
import get from 'lodash/get'
import Tag from '../components/Tag';
import {rhythm, scale} from '../utils/typography'

/**
 * this class will render all the blog MD files into html
 */
class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = get(this.props, 'data.site.siteMetadata.title')
    return (
      <div>
        <Helmet title={`${post.frontmatter.title} | ${siteTitle}`}/>
        <h1>{post.frontmatter.title}</h1>
        <div style={{marginTop: `-20px`}}>{post.frontmatter.date}</div>
        <div style={{paddingTop: `10px`, paddingBottom: `20px`}}>
          {post.frontmatter.tags.map((tag, index) =>
            <Tag key={index} name={tag}/>
          )}
        </div>
        <div dangerouslySetInnerHTML={{__html: post.html}}/>
        <hr style={{marginBottom: rhythm(1),}}/>
      </div>
    )
  }
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
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      id
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
      }
    }
  }
`
