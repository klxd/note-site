import React from "react"
import PropTypes from "prop-types"
import "../less/component/button.less"

export default class Button extends React.Component {
  render() {
    return (
      <button
        className={
          `button-component ` + (this.props.disabled ? "disabled" : "")
        }
        onClick={this.props.onClick}
        disabled={this.props.disabled}
      >
        {this.props.label}
      </button>
    )
  }
}
Button.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
}
