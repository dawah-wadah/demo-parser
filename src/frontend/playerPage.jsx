import React from "react";
import { Switch, Route } from "react-router-dom";
import firebase from "firebase";
import Overview from "./player_page/overview";
import PropsRoute from "./prop_routes";
import Heatmap from "./heatmap";
import PlayerHeader from "./player-header";
import PlayerTabs from "./player-tab";
import KDChart from "./kd_chart";
import ResizableTest from "./resize-test.jsx";

export default class PlayerPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  getState(num) {
    switch (num) {
      case 0:
        return { state: "Offline", color: "grey" };
      case 1:
        return { state: "Online", color: "green" };
      case 2:
        return { state: "Busy", color: "orange" };
      case 3:
        return { state: "Away", color: "red" };
      case 4:
        return { state: "Snoozed", color: "yellow" };
      case 5:
        return { state: "Looking For Trade", color: "purple" };
      case 6:
        return { state: "Looking to Play", color: "white" };

      default:
        break;
    }
  }

  componentDidMount() {
    //currently locked to my account 'Taylor Swift' alter it with the match.params.id, assuming the address bar will link to the steamid
    const playerId = this.props.match.params.id;

    firebase
      .database()
      .ref(`/players/${playerId}`)
      .once("value", snap => {
        this.setState({ player: snap.val() });
        return snap.val();
      });
    // .then(info => {
    // let id = info.val().steamInfo.id;
    // this.getSteamInfo(id);
    // });
  }

  getSteamInfo(id) {
    let url =
      "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?" +
      "key=" +
      process.env.steamKey +
      "&steamids=" +
      id;

    fetch(url)
      .then(results => results.json())
      .then(data => {
        let players = data.response.players;
        players.forEach(player => {
          this.updateFirebaseInfo(player).then(() => {
            this.setState({ status: this.getState(player.profilestate) });
          });
        });
      })
      .catch(err => console.log(err.message));
  }

  updateFirebaseInfo(player) {
    let id = player.steamid;
    //this will refetch any data from steam, may not work if you try this out locally because of CORS, so u may need to download a CORS Anywhere extension
    return firebase
      .database()
      .ref("/")
      .update({
        [`players/${id}/steamInfo/name`]: player.personaname,
        [`players/${id}/steamInfo/imageFull`]: player.avatarfull,
        [`players/${id}/steamInfo/imageMed`]: player.avatarmedium,
        [`players/${id}/steamInfo/imageSmall`]: player.avatar,
        [`players/${id}/steamInfo/id`]: player.steamid,
        [`players/${id}/steamInfo/profile`]: player.profileurl
      });
  }

  render() {
    if (!this.state.player) {
      return (
        <div className="player-page">
          <div className="spinning-logo" />;
        </div>
      );
    }

    const { player } = this.state;
    const { steamInfo, games } = player;

    return (
      <div className="player-page">
        <PlayerHeader steamInfo={steamInfo} />
        <PlayerTabs id={steamInfo.id} />
        <div className="player-body">
          <Switch>
            <PropsRoute
              exact
              path={`/players/:id`}
              component={KDChart}
              games={games}
              id={steamInfo.id}
            />
            <PropsRoute
              exact
              path={`/players/:id/overview`}
              component={Overview}
              player={player}
            />
            <Route
              exact
              path={`/players/:id/weapons`}
              render={() => (
                <ResizableTest
                  data={player["Weapons Data"]}
                  player={steamInfo.id}
                />
              )}
            />
            <Route
              exact
              path={`/players/:id/heatmap`}
              render={() => <Heatmap gameData={games} />}
            />
          </Switch>
        </div>
      </div>
    );
  }
}
