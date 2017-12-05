import React from 'react'
import Link from 'gatsby-link'


export default class GoTop extends React.Component {
  render() {
    const name = this.props.name;
    const count = this.props.count || '';
    return (
      <div className="corner-container">
        <button className="corner-button" data-tooltip="回到顶部" data-tooltip-position="left"
                aria-label="回到顶部" type="button">
          <svg className="Zi Zi--BackToTop" title="回到顶部" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M16.036 19.59a1 1 0 0 1-.997.995H9.032a.996.996 0 0 1-.997-.996v-7.005H5.03c-1.1
            0-1.36-.633-.578-1.416L11.33 4.29a1.003 1.003 0 0 1 1.412 0l6.878 6.88c.782.78.523
            1.415-.58 1.415h-3.004v7.005z"
            />
          </svg>
        </button>
      </div>
    )
  }
}
