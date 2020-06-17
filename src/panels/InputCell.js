import React from "react";

class InputCell extends React.Component {
  render() {
    const {
      value,
      mark,
      subject,
      onChange,
      disabled,
      onFocus,
      onBlur,
    } = this.props;
    const style = {
      float: "left",
      padding: 0,
      margin: 0,
      border: "none",
      width: "18px",
      outline: "none",
      fontSize: "small",
      backgroundColor: "var(--header_background)",
      color: "var(--header_text)",
    };

    return !disabled ? (
      <input
        style={style}
        value={value === 0 ? "" : value}
        data-mark={mark}
        onFocus={onFocus}
        onBlur={onBlur}
        data-subject={subject}
        onChange={onChange}
        maxLength={2}
        type="tel"
      />
    ) : (
      <div style={style}>{value === 0 ? "" : value}</div>
    );
  }
}

export default InputCell;
