import React from 'react';

export default class StyleButton extends React.Component {
  constructor() {
    super();
    this.onToggle = (e) => {
      e.preventDefault();
      this.props.onToggle(this.props.style);
    };
  }

  renderIcon() {
    if (this.props.icon) {
      return <i className="material-icons">{this.props.label}</i>
    } else {
      return this.props.label
    }
  }

  render() {
    let className = 'RichEditor-styleButton';
    if (this.props.active) {
      className += ' RichEditor-activeButton';
    }

    return (
      <span className={className} onMouseDown={this.onToggle}>
        {this.renderIcon()}
      </span>
    );
  }
}