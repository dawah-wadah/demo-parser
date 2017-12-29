import React from "react";
import firebase from "firebase";
import WeaponsChart from './weapons_chart.jsx'
import * as APIKeys from "../keys.json";

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
    firebase
      .database()
      .ref("/76561198027906568/")
      .once("value", snap => {
        this.setState({
          player: snap.val()
        });
        return snap.val();
      })
      .then(info => {
        let id = info.val().steamInfo.id;
        this.getSteamInfo(id);
      });
  }

  updateFirebaseInfo(player) {
    let id = player.steamid;
    return firebase
      .database()
      .ref("/")
      .update({
        [id + `/steamInfo/name`]: player.personaname,
        [id + `/steamInfo/imageFull`]: player.avatarfull,
        [id + `/steamInfo/imageMed`]: player.avatarmedium,
        [id + `/steamInfo/imageSmall`]: player.avatar,
        [id + `/steamInfo/id`]: player.steamid,
        [id + `/steamInfo/profile`]: player.profileurl
      });
  }

  getSteamInfo(id) {
    let url =
      "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?" +
      "key=" +
      APIKeys.steamKey +
      "&steamids=" +
      id;
    fetch(url)
      .then(results => results.json())
      .then(data => {
        let shit = data.response.players;
        shit.forEach(player => {
          this.updateFirebaseInfo(player).then(() => {
            this.setState({ status: this.getState(player.profilestate) });
          });
        });
      })
      .catch(err => console.log(err.message));
  }

  render() {
    if (this.state.player && this.state.status) {
      let player = this.state.player;
      let steamInfo = player.steamInfo;
      return <div className="player-page">
          <div className="player-header">
            <div className="player-header-image" style={{ backgroundImage: "url(" + steamInfo.imageFull + ")" }} />
            <div className="player-info">
              <div className="player-header-name">{steamInfo.name}</div>
              <div className="player-status">
                <div>{this.state.status.state}</div>
                <div className="circle" style={{ background: this.state.status.color }} />
              </div>
            </div>
          </div>
          <div className="player-body">
            <WeaponsChart weapons={this.state.player["Weapons Data"]} />
          </div>
        </div>;
    } else {
      return null;
    }
  }
}
