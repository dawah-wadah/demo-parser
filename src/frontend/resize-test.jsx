import React from "react";
import WeaponsChart from "./weapons_chart.jsx";

import Body from "./body.jsx";

export default class ResizableTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 0,
      weaponsName: ""
    };
  }

  changeWeapon(weaponName) {
    let width = "20%";
    let x = "80%"
    let oldWeapon = this.state.weaponName;
    if (oldWeapon === weaponName) {
      width = 0;
      weaponName = "";
      x = "100%"
    }

    this.setState({ width, weaponName, x });
  }

  render() {
    const { weaponName, x } = this.state;
    const { player } = this.props;

    return (
      <div className="resize-parent">
        <div className="flex full">
          <div className="resize-child first" style={{width: x}}>
            <WeaponsChart
              weapons={this.props.data}
              player={player}
              changeWeapon={name => this.changeWeapon(name)}
            />
          </div>
          <div className="resize-child second" style={this.state}>
            <Body weapon={{ weaponName }} id={player} />
          </div>
        </div>
      </div>
    );
  }
}
