const _ = require("lodash")
const Promise = require("bluebird")
const path = require("path")
// const select = require(`unist-util-select`)
// const fs = require(`fs-extra`)

exports.createPages = ({graphql, boundActionCreators}) => {
  const {createPage} = boundActionCreators

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve("./src/templates/blog-post.js")
    const tagPagesTemplate = path.resolve("./src/templates/tag-route.js")
    const game2048 = path.resolve("./src/components/Game2048.js")
    resolve(
      graphql(
        `
      {
        allMarkdownRemark(limit: 1000) {
          edges {
            node {
              frontmatter {
                path
                tags
              }
            }
          }
        }
      }
    `
      ).then(result => {
        if (result.errors) {
          // console.log(result.errors)
          reject(result.errors)
        }

        // Create blog posts pages.
        _.each(result.data.allMarkdownRemark.edges, edge => {
          createPage({
            path: edge.node.frontmatter.path,
            component: blogPost,
            context: {
              path: edge.node.frontmatter.path,
            },
          })
        })

        // create tag pages
        let tags = [];
        result.data.allMarkdownRemark.edges.forEach(edge => {
            if (edge.node.frontmatter.tags) {
              tags = tags.concat(edge.node.frontmatter.tags)
            }
          }
        );
        tags = _.uniq(tags);
        tags.forEach(tag => {
          createPage({
            path: `/tags/${_.kebabCase(tag)}/`,
            component: tagPagesTemplate,
            context: {
              tag
            }
          })
        })

        // create games pages
        createPage({
          path: `/games/2048/`,
          component: game2048,
          context: {}
        })
      })
    )
  })
}
