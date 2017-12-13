import React from "react"
import Link from "gatsby-link"
import get from "lodash/get"
import Helmet from "react-helmet"
import Bio from "../components/Bio"
import Tag from "../components/Tag"
import Card from "../components/Card";
// import {rhythm} from "../utils/typography"

import '../less/page/main-page.less';


/** this class combine all the blog-posts as an index page */
class BlogIndex extends React.Component {
  render() {
    const siteTitle = get(this, "props.data.site.siteMetadata.title");
    const posts = get(this, "props.data.allMarkdownRemark.edges");
    const allTags = get(this, "props.data.allMarkdownRemark.group");
    return (
      <div className="main-page">
        <Helmet title={siteTitle}/>
        {/*<Bio/>*/}
        <div className="main-container">
          <div className="main-content">
            {
              posts.map((post, index) => {
                if (post.node.path !== "/404/") {
                  const title = get(post, "node.frontmatter.title") || post.node.path;
                  return (
                    <div key={index} className="post-item">
                      <div className="post-header-row">
                        <div key={post.node.frontmatter.path} className="post-header">
                          <Link style={{boxShadow: "none"}} to={post.node.frontmatter.path}>
                            {post.node.frontmatter.title}
                          </Link>
                        </div>
                        <div className="post-date">
                          {post.node.frontmatter.date}
                        </div>
                      </div>
                      <div className="post-tags">
                        {post.node.frontmatter.tags.map((tag, index) => <Tag key={index} name={tag}/>)}
                      </div>

                      <p className="post-excerpt" dangerouslySetInnerHTML={{__html: post.node.excerpt}}/>
                    </div>
                  )
                }
              })}
          </div>

          <div className="right-side-bar">
            <Card header={'Games'}>
              <Tag name={'2048'} linkTo={'/games/2048'}/>
            </Card>

            <Card header={'Tags'}>
              {allTags.map((tag, index) =>
                <Tag key={index} name={tag.fieldValue} count={tag.totalCount}/>)}
            </Card>
          </div>
        </div>
      </div>
    )
  }
}

BlogIndex.propTypes = {
  route: React.PropTypes.object,
};

export default BlogIndex
// use when building
export const pageQuery = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          frontmatter {
            title
            path
            date(formatString: "DD MMMM, YYYY")
            tags
          }
          
        }
      }
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
