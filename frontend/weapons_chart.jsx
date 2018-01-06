import React from "react";
import { values } from "lodash";
import firebase from "firebase";
import Foo from "./foo";
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

  componentDidMount() {
    const { weapons, player } = this.state;
    const username = "76561198027906568";

    // firebase
    //   .database()
    //   .ref(`/${player}/Weapons Data`)
    //   .limitToLast(25)
    //   .once("value", snapshot => {
    //     let games = values(snapshot.val());
    //     let i = games.length;
    //     this.setState({
    //       weapons: snapshot.val()
    //     });
    //   });
  }

  handleRowClick(rowId) {
    const currentExpandedRows = this.state.expandedRows;
    const isRowCurrentlyExpanded = currentExpandedRows.includes(rowId);

    const newExpandedRows = [rowId];
    // const newExpandedRows = isRowCurrentlyExpanded
    //   ? currentExpandedRows.filter(id => id !== rowId)
    //   : currentExpandedRows.concat(rowId);

    this.setState({
      expandedRows: newExpandedRows
    });
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
      damageDone += game.damage_dealt;
      shotsFired += game.totalShots;
      totalHits += game.totalHits;

      Object.keys(game.hitGroups).forEach(limb => {
        hitGroups[limb] += game.hitGroups[limb];
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
          console.log("It was in this column:", column);
          console.log("It was in this row:", rowInfo);
        }
      };
    };
    if (!this.state.weapons) {
      return null;
    }
    return (
      <ReactTable
        className="-striped -highlight"
        defaultSorted={[{ id: "fired", desc: true }]}
        data={data}
        columns={shit}
        onExpandedChange={(newExpanded, index, event) => {
          console.log(newExpanded);
          this.setState({ expandedRows: { [index]: !expandedRows[index] } });
        }}
        expanded={expandedRows}
        getTrProps={onRowClick}
        SubComponent={row => {
          debugger;
          return <Foo weaponName={row.original.name} player={player} />;
        }}
      />
    );
  }
}

const TableRow = ({ row, renderDamage }) => {
  return [
    <tr onClick={() => renderDamage(row.name)}>
      <td>
        <img src={`assets/weapons/weapon_${row.name}.svg`} />
      </td>
      <td>{row.name}</td>
      <td>{row.shotsFired}</td>
      <td>{row.damageDone}</td>
      <td>{row.totalHits}</td>
      <td>{Math.floor((row.totalHits / row.shotsFired).toFixed(2) * 100)}%</td>
    </tr>,
    <tr>
      <td id="chart-shit" colSpan="6">
        <Foo />
      </td>
    </tr>
  ];
};
