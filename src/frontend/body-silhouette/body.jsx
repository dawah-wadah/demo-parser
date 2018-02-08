import React from "react";
import firebase from "firebase";

import Limb from "./limb.jsx";

const fullBody = () => ({
  display: "flex",
  flexDirection: "column",
  height: "500px",
  width: "275px"
});

export default class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hitGroups: {
        head: 0,
        torso: 0,
        "left-arm": 0,
        "right-arm": 0,
        "left-leg": 0,
        "right-leg": 0,
        total: 0
      }
    };
  }

  componentDidMount() {
    this.getAccuracyData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.getAccuracyData(nextProps);
    }
  }

  getAccuracyData(props) {
    let weapon = props.weapon.weaponName;
    let hitGroups = {
      head: 0,
      "left-arm": 0,
      "left-leg": 0,
      "right-arm": 0,
      "right-leg": 0,
      torso: 0,
      total: 0
    };

    if (!weapon) return null;

    let {id} = props;

    firebase
      .database()
      .ref(`/players/${id}/Weapons Data/${weapon}`)
      .once("value", snap => {
        Object.keys(snap.val()).forEach(push => {
          let slice = snap.val()[push].hitGroups;

          if (!slice) return;

          Object.keys(slice).forEach(section => {
            hitGroups[section] += slice[section] || 0;
          });
          hitGroups.total += snap.val()[push].totalHits;
        });
      })
      .then(() => this.setState({ hitGroups }));
  }

  backgroundImage(limb) {
    const bodyPart =  limb.split(" ").join("-");
    return `url(/assets/body-parts/${bodyPart}.png)`;
  }

  calcOpacity(limb) {
    let ratio = this.state.hitGroups[limb] / this.state.hitGroups.total;
    ratio = ratio ? ratio : 0;
    return ratio * 5;
  }

  render() {
    return (
      <div className="body" style={fullBody()}>
        <div className="body-upper-section">
          <div className="body-head">
            <Limb
              image={this.backgroundImage("head")}
              opacity={this.calcOpacity("head")}
            />
          </div>
        </div>
        <div className="body-mid-section">
          <div className="body-arm">
            <Limb
              image={this.backgroundImage("right arm")}
              opacity={this.calcOpacity("right-arm")}
            />
          </div>
          <div className="body-body">
            <Limb
              image={this.backgroundImage("torso")}
              opacity={this.calcOpacity("torso")}
            />
          </div>
          <div className="body-arm">
            <Limb
              image={this.backgroundImage("left arm")}
              opacity={this.calcOpacity("left-arm")}
            />
          </div>
        </div>
        <div className="body-lower-section">
          <div className="body-legs">
            <Limb
              image={this.backgroundImage("right leg")}
              opacity={this.calcOpacity("right-leg")}
            />
          </div>
          <div className="body-legs">
            <Limb
              image={this.backgroundImage("left leg")}
              opacity={this.calcOpacity("left-leg")}
            />
          </div>
        </div>
      </div>
    );
  }
}
