import React from "react";

export default class WeaponsChart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let weapons = Object.keys(this.props.weapons).map(name => ({ name }));

    return (
      <table>
        <tbody>
          <tr>
            <th>Icon</th>
            <th>Weapon Name</th>
          </tr>
          {weapons.map(weapon => {
            return <TableRow row={weapon} />;
          })}
        </tbody>
      </table>
    );
  }
}

const TableRow = ({ row }) => {
  return (
    <tr>
      <td>
        <img src={"assets/weapons/weapon_" + row.name + ".svg"} />
      </td>
      <td>{row.name}</td>
    </tr>
  );
};
