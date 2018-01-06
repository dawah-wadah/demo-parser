import React from "react";

const Panel = ({ title, element }) => {
  return (
    <div class="panel">
      <div class="heading">
        <span class="title">{title}</span>
      </div>
      <div class="content">{element}</div>
    </div>
  );
};

export default Panel;
