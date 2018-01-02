import React from "react";
import { values } from "lodash";

export default class WeaponsChart extends React.Component {
  constructor(props) {
    super(props);

  }

  processData() {
    let weapons = Object.keys(this.props.weapons).map(name =>
      this.processWeapon(name)
    );

    return weapons.sort((a,b) => (b.shotsFired - a.shotsFired));
  }

  processWeapon(name) {
    let hitGroups = {
      head: 0,
      "left-arm": 0,
      "left-leg": 0,
      "right-arm": 0,
      "right-leg": 0,
      torso: 0,
      total: 0
    };
    let damageDone = 0;
    let shotsFired = 0;
    let totalHits = 0;

    values(this.props.weapons[name]).forEach(game => {
      damageDone += game.damage_dealt;
      shotsFired += game.totalShots;
      totalHits += game.totalHits;
      Object.keys(game.hitGroups).forEach(limb => {
        hitGroups[limb] += game.hitGroups[limb];
      });
    });
    return {
      name,
      hitGroups,
      damageDone,
      shotsFired,
      totalHits
    };
  }

  render() {
    let weapons = this.processData();
    return (
      <table className="weapons-table">
        <tbody>
          <tr>
            <th> </th>
            <th>Weapon Name</th>
            <th>Shots Fired</th>
            <th>Damage Done</th>
            <th>Total Hits</th>
            <th>Accuracy</th>
          </tr>
          {weapons.map(weapon => {
            return <TableRow row={weapon} cb={this.props.cb}/>;
          })}
        </tbody>
      </table>
    );
  }
}

const TableRow = ({ row, cb }) => {
  return <tr onClick={() => cb(row.name)}>
      <td>
        <img src={"assets/weapons/weapon_" + row.name + ".svg"} />
      </td>
      <td>{row.name}</td>
      <td>{row.shotsFired}</td>
      <td>{row.damageDone}</td>
      <td>{row.totalHits}</td>

      <td>{Math.floor((row.totalHits / row.shotsFired).toFixed(2) * 100)}%</td>
    </tr>;
};
