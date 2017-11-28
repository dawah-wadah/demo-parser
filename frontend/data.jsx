import React from "react";
import firebase from "firebase";
import * as d3 from "d3";

export default class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.createChart = this.createChart.bind(this);
  }

  getShit(args) {
    let data = {};
    Object.keys(args).forEach(weapon => {
      let weaponData = { [weapon]: { fired: 0, hits: 0, headshots: 0 } };
      console.log(weapon);
      Object.keys(args[weapon]).forEach(key => {
        weaponData[weapon].fired += args[weapon][key].totalShots;
        weaponData[weapon].hits += args[weapon][key].totalHits;
        weaponData[weapon].headshots += args[weapon][key].headshots;
      });
      // data.push(weaponData);
      data[weapon] = weaponData[weapon];
      // data.push({ [weapon]: args[weapon] });
    });
    this.setState({ weaponData: data });
    // data;
  }

  componentDidMount() {
    firebase
      .database()
      .ref("/Taylor Swift/Weapons Data")
      .once("value", snapshot => {
        this.getShit(snapshot.val());
      })
      .then(() => this.createChart());
  }

  adjustRadius(weapon) {
    const { weaponData } = this.state;
    const accuracy = (weaponData[weapon].hits / weaponData[weapon].fired * 100) + 20;

    if (accuracy < 25) {
      return 25;
    } else if (accuracy > 80) {
      return 80;
    }

    return accuracy;
  }

  createChart() {
    const svg = d3.select(this.node);
    const element = svg.selectAll("g").data(Object.keys(this.state.weaponData));
    const elemEnter = element.enter()
        .append("g")
        .attr("transform", d => `translate(${Math.random() * 900 + 1}, ${Math.random() * 900 + 1})`);
    console.log(this.state.weaponData);
    const circle = elemEnter.append("circle")
        .attr("r", d => this.adjustRadius(d))
        .attr("fill", "pink");

    elemEnter.append("text")
      .attr("dx", d => -20)
      .text(d);
  }

  render() {
    return <svg ref={node => this.node = node} width="960" height="960" />;
    // return (<h1>Wadah is Retarded</h1>);
  }
}
