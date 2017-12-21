import React from 'react'
import Link from 'gatsby-link'
import '../less/component/shelter.less'

export default class Shelter extends React.Component {

  static offsetY = 62;

  componentWillMount() {
    if (typeof window !== `undefined`) {
      window.addEventListener("hashchange", function() {
        setTimeout(function() {
          const hash = window.decodeURI(window.location.hash.replace(`#`, ``));
          if (hash !== ``) {
            const element = document.getElementById(hash);
            if (element) {
              const offset = element.offsetTop;
              window.scrollTo(0, offset - Shelter.offsetY);
            }
          }
        }, 11);
      }.bind(this));
    }
  }

  render() {
    return (
      <div className="shelter-component">
        <div className="shelter-inner">
          <Link className="header-text" to={'/'}>Note Site</Link>
          <div className="navigation">
            <Link to={'/'}>首页</Link>
            <Link to={'/tags'}>标签</Link>
            <Link to={'/games/2048'}>游戏</Link>
          </div>

          <div className="user-info">
            <a href={'https://github.com/klxd/note-site'}>
              <svg fill="currentColor" viewBox="0 0 40 40" width="24" height="24">
                <path
                  d="m20 0c-11 0-20 9-20 20 0 8.8 5.7 16.3 13.7 19 1 0.2 1.3-0.5 1.3-1 0-0.5 0-2
                  0-3.7-5.5 1.2-6.7-2.4-6.7-2.4-0.9-2.3-2.2-2.9-2.2-2.9-1.9-1.2 0.1-1.2 0.1-1.2
                  2 0.1 3.1 2.1 3.1 2.1 1.7 3 4.6 2.1 5.8 1.6 0.2-1.3 0.7-2.2 1.3-2.7-4.5-0.5-9.2-2.2-9.2-9.8
                  0-2.2 0.8-4 2.1-5.4-0.2-0.5-0.9-2.6 0.2-5.3 0 0 1.7-0.5 5.5 2 1.6-0.4 3.3-0.6 5-0.6 1.7 0
                  3.4 0.2 5 0.7 3.8-2.6 5.5-2.1 5.5-2.1 1.1 2.8 0.4 4.8 0.2 5.3 1.3 1.4 2.1 3.2 2.1 5.4 0
                  7.6-4.7 9.3-9.2 9.8 0.7 0.6 1.4 1.9 1.4 3.7 0 2.7 0 4.9 0 5.5 0 0.6 0.3 1.2 1.3 1 8-2.7
                  13.7-10.2 13.7-19 0-11-9-20-20-20z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    )
  }
}
Shelter.propTypes = {
  name: React.PropTypes.string,
  count: React.PropTypes.number
};
