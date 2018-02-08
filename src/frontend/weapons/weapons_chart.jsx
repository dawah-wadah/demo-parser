import React from "react";
import { values } from "lodash";

import LineGraph from "../line-chart/line-chart";
import ReactTable from "react-table";

export default class WeaponsChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      weapons: this.props.weapons,
      player: this.props.player,
      expandedRows: []
    };
  }

  generateChartData() {
    return [
      {
        Header: "Weapon",
        id: "image",
        accessor: "name",
        Cell: row => (
          <div className="weapon-name-row">
            <div>
              <img src={`/assets/weapons/weapon_${row.value}.svg`} alt="weapon" />
            </div>
            <div>{row.value}</div>
          </div>
        )
      },
      { Header: "Shots Fired", id: "fired", accessor: "shotsFired" },
      { Header: "Damage Dealt", accessor: "damageDone" },
      { Header: "Total Hits", accessor: "totalHits" },
      {
        Header: "Accuracy",
        id: "accuracy",
        accessor: d => {
          let result = (d.totalHits / d.shotsFired).toFixed(2) * 100;
          return result <= 100 ? result : 100;
        },
        Cell: row => (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#86868c"
            }}
          >
            <div
              className="progress-bar"
              style={{
                width: `${row.value}%`,
                height: "100%",
                backgroundColor:
                  row.value > 66
                    ? "#85cc00"
                    : row.value > 33 ? "#ffbf00" : "#ff2e00",
                transition: "all .2s ease-out"
              }}
            >
              <span>{row.value.toFixed()}%</span>
            </div>
          </div>
        )
      }
    ];
  }

  processData() {
    let weapons = Object.keys(this.state.weapons)
      .map(name => this.processWeapon(name))
      .filter(weapon => weapon.shotsFired !== 0);

    return weapons.sort((a, b) => b.shotsFired - a.shotsFired);
  }

  processWeapon(name) {
    let hitGroups = {
      "head": 0,
      "left-arm": 0,
      "left-leg": 0,
      "right-arm": 0,
      "right-leg": 0,
      "torso": 0,
      "total": 0
    };
    let damageDone = 0;
    let shotsFired = 0;
    let totalHits = 0;

    values(this.state.weapons[name]).forEach(game => {
      damageDone += game.damageDealt || 0;
      shotsFired += game.totalShots || 0;
      totalHits += game.totalHits || 0;

      values(game.hitGroups).forEach(limb => {
        hitGroups[limb] += limb || 0;
      });
    });

    return { name, hitGroups, damageDone, shotsFired, totalHits };
  }

  render() {
    if (!this.state.weapons) {
      return null;
    }

    const { column, expandedRows, player } = this.state;
    const data = this.processData();
    const chartData = this.generateChartData();

    const onRowClick = (state, rowInfo, column, instance) => {
      return {
        onClick: e => {
          let copy = Object.assign(this.state);

          if (copy.expandedRows[rowInfo.index]) {
            copy.expandedRows[rowInfo.index] = !copy.expandedRows[
              rowInfo.index
            ];
          } else {
            copy.weapon = rowInfo.original.name;
            copy.column = column.Header;
            copy.expandedRows = {
              [rowInfo.index]: !copy.expandedRows[rowInfo.index]
            };
          }

          if (column.Header === "Accuracy") {
            this.props.changeWeapon(rowInfo.original.name);
          }
          this.setState(copy);
        }
      };
    };

    return (
      <ReactTable
        className="-striped -highlight"
        defaultSorted={[{ id: "fired", desc: true }]}
        data={data}
        columns={chartData}
        expanded={expandedRows}
        getTdProps={onRowClick}
        SubComponent={row => (
          <LineGraph
            weaponName={row.original.name}
            col={column}
            player={player}
          />
        )}
      />
    );
  }
}
