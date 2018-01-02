import React from "react";
import WeaponsChart from "./weapons_chart.jsx";

import Body from './body.jsx'


export default class ResizableTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      weaponsName: ""
    };

  }

  changeWeapon(weaponName){
    let width = "40%"
    let oldWeapon = this.state.weaponName
    if (oldWeapon == weaponName){
      width = 0
    }

    this.setState({width, weaponName})
  }

  render() {
    let cb = this.changeWeapon

    const {weaponName} = this.state;
    const player = this.props.id;

    return (
      <div className="resize-parent">
        <div className="flex full">
          <div className="resize-child first">
            <WeaponsChart weapons={this.props.data} changeWeapon={(name) => this.changeWeapon(name)} />
          </div>
          <div className="resize-child second" style={this.state}>
            <Body weapon={{weaponName}} id={player}/>
          </div>
        </div>
      </div>
    );
  }
}
