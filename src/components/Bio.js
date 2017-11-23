import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import bookIcon from './../../static/book-icon.ico'
import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <p
        style={{
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={bookIcon}
          alt={`Book Icon`}
          style={{
            float: 'left',
            marginRight: rhythm(1 / 4),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
          }}
        />
        Learning Notes <br/>
        <a href="https://github.com/klxd/note-site">
          Source Code
        </a>
      </p>
    )
  }
}

export default Bio
