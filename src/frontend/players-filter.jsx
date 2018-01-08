import React from "react";
import firebase from "firebase";
import { pickBy, startsWith } from "lodash";

import PlayersIndex from "./players-index";

export default class PlayerFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
      playerName: ""
    };
  }

  componentDidMount() {
    firebase
      .database()
      .ref("/players/")
      .once("value", snap => this.setState({ players: snap.val() }));
  }

  // TO DO: rewrite the function, use closure maybe?
  filterPlayers() {
    const { players } = this.state;

    return pickBy(players, (value, key) => {
      if (!value.steamInfo) return;
      const playerName = value.steamInfo.name.toLowerCase();
      const searchName = this.state.playerName.toLowerCase();

      return startsWith(playerName, searchName);
    });
  }

  update(field) {
    return e => this.setState({ [field]: e.currentTarget.value });
  }

  render() {
    const filteredPlayers = this.filterPlayers();

    return (
      <div className="players-container">
        <div className="filter">
          <input
            type="text"
            name="playername"
            placeholder={"Player's name"}
            value={this.state.playerName}
            onChange={this.update("playerName")}
          />
        </div>
        <PlayersIndex
          players={this.state.players}
          filteredPlayers={filteredPlayers}
        />
      </div>
    );
  }
}
