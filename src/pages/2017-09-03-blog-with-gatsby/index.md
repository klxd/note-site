---
title: 使用Gatsby构建静态博客网站
date: "2017-09-03T22:22:32.169Z"
path:  "/blog-with-gatsby"
tags:
    - web
---

### 为什么使用Gatsby
刚开始想要在**[GitHub Pages](https://pages.github.com/)**上搭建一个博客网站的时候,
我的需要的只是一个可以帮我将普通文本文件转化为HTML的框架,比如已经和GitHub Pages深度集成的
**[Jekyll](https://jekyllrb.com/)**,但是带着探索新技术的心,我还是选择了更加新潮的
[Gatsby](https://www.gatsbyjs.org/).

> Gatsby is a blazing-fast static site generator for React.

从GitHub上简洁的介绍可以看到,这是一个用于快速构建静态网站的框架,并且是使用使用的是[React.js](https://reactjs.org/).
由于工作中使用过React,当我看到连React的官网都是用Gatsby搭建的时候,我决心尝试一下这个框架.


### 安装Gatsby
跟着官方文档<https://www.gatsbyjs.org/docs/>,可以很容易地搭建出Gatsby的开发环境,
如果之前使用过Node.js,应该可以很容易的上手.
```bash
npm install --global gatsby-cli
gatsby new gatsby-site
cd gatsby-site
gatsby develop
```
Gatsby提供了几个默认的starter用于从模板中快速搭建一个网站,虽然starter都比较简单,但是对理解
Gatsby的使用方法有很大帮助.
```bash
gatsby new [SITE_DIRECTORY] [URL_OF_STARTER_GITHUB_REPO]
gatsby new blog https://github.com/gatsbyjs/gatsby-starter-blog
```
***

### Gatsby的项目结构
Gatsby的基本目录结构如下:
```
├── gatsby-config.js
├── package.json
└── src
    ├── html.jsx
    ├── pages
    │   ├── index.jsx
    │   └── posts
    │       ├── 01-01-2017
    │       │   └── index.md
    │       ├── 01-02-2017
    │       │   └── index.md
    │       └── 01-03-2017
    │           └── index.md
    ├── templates
    │   └── post.jsx
    │
    └── layouts
        └── index.jsx
```
**pages目录**  
在这个目录下的React Component会自动转化为静态页面,URL路径由文件名决定,如`src/pages/index.js`
会转化为`domain/`,而`src/pages/about.js`会转化为`domain/about/`.

**templates目录**  
pages目录可以直接构造新页面,而当有许多类似的页面时,直接在pages页面创建会需要做许多重复的工作,
这时可以在templates目录下创建一个模板用于包装,然后使用GraphQL将所需要的数据放入这个模板,从而
自动生成多个类似的页面.

**Layouts目录**  
这个目录下包含了一个React Component(非必须的),它是网站中所有页面的公共容器,可以在这里定义网站
的导航条和脚注.

**html.js文件**  
这个文件定义了整个网站最基本的HTML结构,可以在这个文件里面自定义`<head>`中的内容.
***
### Gatsby插件
Gatsby支持了许许多多的[插件](https://www.gatsbyjs.org/docs/plugins/),我想这才是
许多人选择Gatsby的原因.在网站中加入新的插件支持需要以下两个步骤(以`gatsby-transformer-json`为例):
1. 从npm安装 `npm install --save gatsby-transformer-json`
2. 在gatsby-config.js中配置

```javascript
module.exports = {
  plugins: [`gatsby-transformer-json`],
};
```
***
### 在Gatsby中使用Markdown
说到构建博客网站,一个重要的点就是要将**网站页面逻辑**和**博客文本内容**分离,这样在写博客时
不用关心页面的具体渲染逻辑,我想没有人想在写文章的时候还要想着怎么去调整页面的CSS吧.
Markdown是一种轻量级的文本标记语言,它的特点是可以通过简单的标记语法让文本内容具有一定的格式.
在Gatsby中使用Markdown生成页面需要一下几个步骤:

##### 1.从文件系统从读取Markdown文件
这是通过`gatsby-source-filesystem`插件完成的  
1. 安装`npm i --save gatsby-source-filesystem`
2. 配置`gatsby-config.js`

```javascript
plugins: [
  {
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/path/to/markdown/files`,
      name: "markdown-pages",
    },
  },
];
```
##### 2. 转换Markdown文件
这是通过`gatsby-transformer-remark`插件完成的,这个插件会读取Markdown文件,
将其中元数据部分(metadata)转化为`frontmatter`,将内容部分转化为HTML.  
1. 安装`npm i --save gatsby-transformer-remark`
2. 配置`gatsby-config.js`

```javascript
plugins: [
  `gatsby-transformer-remark`,
];
```

##### 3. 为Markdown数据创建模板组件
在`src/templates/`目录下为转换后的Markdown数据创建模板文件,定义生成的html页面的
具体内容和样式.

```javascript
import React from "react";

export default function Template({
  data, // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data; // data.markdownRemark holds our post data
  const { frontMatter, html } = markdownRemark;
  return (
    <div className="blog-post-container">
      <div className="blog-post">
        <h1>{frontmatter.title}</h1>
        <h2>{frontmatter.date}</h2>
        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
}

export const pageQuery = graphql`
  query BlogPostByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`;
```
需要注意的点:
1. pageQuery用于获取Markdown数据,Gatsby会自动地运行这个语句并返回其查询结果
2. 查询结果会被注入到Template组件中,可以在React组件的render函数中使用

##### 4. 利用Gatsby提供的Node API创建页面
Gatsby提供了强大的[Node.js API](https://www.gatsbyjs.org/docs/node-apis/),
它们可以在`gatsby-node.js`文件中使用.下面将会示范如何使用`createPages`API来创建页面.

```javascript
const path = require('path');

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

  const blogPostTemplate = path.resolve(`src/templates/blogTemplate.js`);

  return graphql(`{
    allMarkdownRemark(
      sort: { order: DESC, fields: [frontmatter___date] }
      limit: 1000
    ) {
      edges {
        node {
          excerpt(pruneLength: 250)
          html
          id
          frontmatter {
            date
            path
            title
          }
        }
      }
    }
  }`)
    .then(result => {
      if (result.errors) {
        return Promise.reject(result.errors);
      }

      result.data.allMarkdownRemark.edges
        .forEach(({ node }) => {
          createPage({
            path: node.frontmatter.path,
            component: blogPostTemplate,
            context: {} // additional data can be passed via context
          });
        });
    });
}
```

- Gatsby会自动调用`gatsby-config.js`文件export的每个函数
- Gatsby在调用函数时会自动注入参数,如`boundActionCreators`和`graphql`
- createPages函数中,先通过graphql获取元数据,然后在回调函数中使用`createPage`创建页面

