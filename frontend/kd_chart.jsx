import React from "react";
import firebase from "firebase";
import * as d3 from "d3";

export default class KDChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  componentDidMount() {
    const username = this.props.match.params.id;
    this.svg = d3.select("div#main-body").append("svg");

    firebase
      .database()
      .ref(`/${username}/de_dust2`)
      .once("value", snapshot => {
        this.extractData(snapshot.val());
      });
  }

  extractData(sides) {
    debugger;
    let data = {
      CTKills: Object.keys(sides["Counter-Terrorist"].kills).length || 0,
      TKills:  0,
      CTDeaths: Object.keys(sides["Counter-Terrorist"].deaths).length || 0,
      TDeath: 0
    };

    this.setState({ data });
  }

  yo() {
    if (!this.state.data) { return null }
    return this.state.data.CTKills;
  }

  render() {
    debugger;
    return (<div>{this.yo()}</div>)
  }
}
