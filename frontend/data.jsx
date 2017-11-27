import React from "react";
import firebase from "firebase";
import * as d3 from "d3";

export default class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getShit(args) {
    let data = [];
    Object.keys(args).forEach(weapon => {
      let weaponData = { [weapon]: { fired: 0, hits: 0, headshots: 0 } };
      console.log(weapon);
      Object.keys(args[weapon]).forEach(key => {
        weaponData[weapon].fired += args[weapon][key].totalShots;
        weaponData[weapon].hits += args[weapon][key].totalHits;
        weaponData[weapon].headshots += args[weapon][key].headshots;
      });
      data.push(weaponData);
      // data.push({ [weapon]: args[weapon] });
    });
    console.log(data);
    // data;
  }

  componentDidMount() {
    firebase
      .database()
      .ref("/Taylor Swift/Weapons Data")
      .once("value", snapshot => {
        this.getShit(snapshot.val());
        // console.log(snapshot.val());
      });
  }

  render() {
    let svg = d3.select("svg").attr("width", 950);
    console.log(svg);

    // // let width = +svg.attr("width");
    // // let height = svg.attr("height");
    // // console.log(width);
    // //   height = svg.attr("height");
    // //
    // console.log(svg);
    //   d3.select("body")
    // .append("svg")
    //   .attr("width", 960)
    //   .attr("height", 500)
    // .append("g")
    //   .attr("transform", "translate(20,20)")
    // .append("rect")
    //   .attr("width", 920)
    //   .attr("height", 460);
    // let format = d3.format(",d");
    // return <svg width="960" height="960" />;
    return <h1>Wadah is Retarded</h1>;
  }
}
