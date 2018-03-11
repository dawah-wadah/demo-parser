import React from 'react';

import PlayerFilter from "../filter/players-filter";
import Uploader from "../uploader/uploader-main";

export default class Mainpage extends React.Component {
  render() {
    return (
      <div className="body-main">
        <Uploader />
        <PlayerFilter />
      </div>
    )
  }
}
