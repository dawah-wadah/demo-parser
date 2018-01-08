import React from "react";
import { values } from "lodash";
import firebase from "firebase";
import LineGraph from "./line-chart";
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

  processData() {
    if (!this.state.weapons) {
      return null;
    }
    let weapons = Object.keys(this.state.weapons).map(name =>
      this.processWeapon(name)
    );
    return weapons.sort((a, b) => b.shotsFired - a.shotsFired);
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
    const data = this.processData();
    
    const { expandedRows, player } = this.state;
    const shit = [
      {
        Header: "",
        id: "image",
        accessor: d => <img src={`assets/weapons/weapon_${d.name}.svg`} />
      },
      { Header: "Weapon Name", accessor: "name" },
      { Header: "Shots Fired", id: "fired", accessor: "shotsFired" },
      { Header: "Damage Dealt", accessor: "damageDone" },
      { Header: "Total Hits", accessor: "totalHits" },
      {
        Header: "Accuracy",
        id: "accuracy",
        accessor: d => (d.totalHits / d.shotsFired).toFixed(2) * 100,
        Cell: row => (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#dadada",
              borderRadius: "2px"
            }}
          >
            <div
              style={{
                width: `${row.value}%`,
                height: "100%",
                backgroundColor:
                  row.value > 66
                    ? "#85cc00"
                    : row.value > 33 ? "#ffbf00" : "#ff2e00",
                borderRadius: "2px",
                transition: "all .2s ease-out"
              }}
            />
          </div>
        )
      }
    ];

    const onRowClick = (state, rowInfo, column, instance) => {
      return {
        onClick: e => {
          let copy = this.state;
          if (copy.expandedRows[rowInfo.index]) {
            {
              copy.expandedRows[rowInfo.index] = !copy.expandedRows[
                rowInfo.index
              ];
            }
          } else {
            (copy.weapon = rowInfo.original.name),
              (copy.column = column.Header),
              (copy.expandedRows = {
                [rowInfo.index]: !copy.expandedRows[rowInfo.index]
              });
          }

          if (column.Header == "Accuracy") {
            this.props.changeWeapon(rowInfo.original.name);
          }
          this.setState(copy);
        }
      };
    };
    if (!this.state.weapons) {
      return null;
    }
    const { column } = this.state;
    return (
      <ReactTable
        className="-striped -highlight"
        defaultSorted={[{ id: "fired", desc: true }]}
        data={data}
        columns={shit}
        expanded={expandedRows}
        getTdProps={onRowClick}
        SubComponent={row => {
          return (
            <LineGraph weaponName={row.original.name} col={column} player={player} />
          );
        }}
      />
    );
  }
}
