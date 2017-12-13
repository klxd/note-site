import React from 'react'
import '../less/component/button.less'

export default class Button extends React.Component {
  render() {
    return (
      <button className="button-component" onClick={this.props.onClick}>
        {this.props.label}
      </button>
    )
  }
}
Button.propTypes = {
  label: React.PropTypes.string,
  onClick: React.PropTypes.func,
};
