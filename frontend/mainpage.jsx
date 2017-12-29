import React from 'react';

import PlayerFilter from "./players-filter";

export default class Mainpage extends React.Component {
  render() {
    return (
      <div className="body-main">
        <PlayerFilter />
      </div>
    )
  }
}
