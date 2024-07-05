import React from "react";
import PropTypes from "prop-types";

const Button = ({ className, label, onClick }) => {
  return (
    <button className={`button ${className}`} onClick={() => onClick(label)}>
      {label}
    </button>
  );
};

Button.propTypes = {
  className: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Button;
