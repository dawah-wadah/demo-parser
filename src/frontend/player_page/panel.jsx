import React from "react";

const Panel = ({ title, elements }) => {
  return (
    <div className="panel">
      <div className="heading">
        <span className="title">{title}</span>
      </div>
      <div className="content">{elements}</div>
    </div>
  );
};

export default Panel;
