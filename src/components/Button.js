import React from 'react'
import '../less/component/button.less'

export default class Button extends React.Component {
  render() {

    return (
      <button className={`button-component ` + (this.props.disabled ? 'disabled' : '')} onClick={this.props.onClick}
              disabled={this.props.disabled}>
        {this.props.label}
      </button>
    )
  }
}
Button.propTypes = {
  label: React.PropTypes.string,
  onClick: React.PropTypes.func,
  disabled: React.PropTypes.bool,
};
