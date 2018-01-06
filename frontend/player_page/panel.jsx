import React from "react";

const Panel = ({ title, element }) => {
  return (
    <div className="panel">
      <div className="heading">
        <span className="title">{title}</span>
      </div>
      <div className="content">{element}</div>
    </div>
  );
};

export default Panel;
