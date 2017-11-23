import React from "react"

const packageJosn = require('../package.json');
const homePageUrl = packageJosn.homepage;

let faviconUrl = '/';
let stylesStr
if (process.env.NODE_ENV === `production`) {
  try {
    stylesStr = require(`!raw-loader!../public/styles.css`)
    faviconUrl = homePageUrl + faviconUrl;
  } catch (e) {
    console.log(e)
  }
}



/**
 * this class define the root HTML element,
 * the render function will run in back-end
 */
module.exports = class HTML extends React.Component {
  render() {
    let css = process.env.NODE_ENV === `production` ? (
        <style
          id="gatsby-inlined-css"
          dangerouslySetInnerHTML={{__html: stylesStr}}
        />
      ) : null;

    return (
      <html>
        <head>
          <link rel="shortcut icon" href={faviconUrl + 'favicon.ico'}/>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          {this.props.headComponents}
          {css}
        </head>
        <body>
          {this.props.preBodyComponents}
          <div
            key={`body`}
            id="___gatsby"
            dangerouslySetInnerHTML={{ __html: this.props.body }}
          />
          {this.props.postBodyComponents}
        </body>
      </html>
    )
  }
};
