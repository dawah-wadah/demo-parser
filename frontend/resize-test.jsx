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

    this.resize = this.resize.bind(this);
  }

  resize() {
    let width = this.state.width ? 0 : "40%";
    this.setState({ width });
  }

  changeWeapon(weaponName){
    this.setState({ weaponName });
  }

  render() {
    let cb = this.changeWeapon

    const {weaponName} = this.state;
    const player = this.props.id;

    return (
      <div className="resize-parent">
        <button onClick={this.resize}>Resize</button>
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
