import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";

const Display = ({ value, onChange, onClick, isEditing, onBlur }) => {
  const displayRef = useRef(null);

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollLeft = displayRef.current.scrollWidth;
    }
  }, [value]);

  return (
    <input
      type="text"
      className={`calculator-display ${isEditing ? "editing" : ""}`}
      value={value}
      onClick={onClick}
      onChange={onChange}
      readOnly={!isEditing}
      onBlur={onBlur}
      ref={displayRef}
    />
  );
};

Display.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onBlur: PropTypes.func.isRequired,
};

export default Display;
