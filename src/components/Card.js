import React from 'react'
import '../less/component/card.less'

export default class Card extends React.Component {
  render() {
    const header = this.props.header;
    return (
      <div className="card-component">
        <div className={"header"}>{header}</div>
        {this.props.children}
      </div>
    )
  }
}
Card.propTypes = {
  header: React.PropTypes.string,
  count: React.PropTypes.number,
  // children: React.PropTypes.object,
};
