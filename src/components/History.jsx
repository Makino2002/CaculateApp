import React from "react";
import PropTypes from "prop-types";

const History = ({ history }) => {
  return (
    <div className="history">
      <h3>History</h3>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>{entry}</li>
        ))}
      </ul>
    </div>
  );
};

History.propTypes = {
  history: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default History;
