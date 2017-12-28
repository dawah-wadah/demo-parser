import React from "react";
import Limb from "./limb.jsx";

const fullBody = () => ({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  height: "500px",
  width: "200px"
});
export default class Body extends React.Component {
  constructor(props) {
    super(props);
  }

  headStyle() {
    return {
      backgroundImage: "url(assets/body-parts/head.png)",
      width: "24%",
      height: "100%"
    };
  }
  torsoStyle() {
    return {
      backgroundImage: "url(assets/body-parts/body2.png)",
      width: "100%",
      height: "100%"
    };
  }
  leftArmStyle() {
    return {
      backgroundImage: "url(assets/body-parts/left-arm.png)",
      width: "100%",
      height: "100%"
    };
  }
  rightArmStyle() {
    return {
      backgroundImage: "url(assets/body-parts/right-arm.png)",
      width: "100%",
      height: "100%"
    };
  }
  rightLegStyle() {
    return {
      backgroundImage: "url(assets/body-parts/right-leg.png)",
      width: "100%",
      height: "100%"
    };
  }
  leftLegStyle() {
    return {
      backgroundImage: "url(assets/body-parts/left-leg.png)",
      width: "100%",
      height: "100%"
    };
  }

  render() {
    return (
      <div className="body" style={fullBody()}>
        <div className="body-upper-section">
          <Limb
            styleGuide={this.headStyle()}
            width="100%"
            classname={"body-head"}
          />
        </div>
        <div className="body-mid-section">
          <div className="body-arm">
            <Limb styleGuide={this.rightArmStyle()} />
          </div>
          <div className="body-body">
            <Limb styleGuide={this.torsoStyle()} />
          </div>
          <div className="body-arm">
            <Limb styleGuide={this.leftArmStyle()} />
          </div>
        </div>
        <div className="body-lower-section">
          <div className="body-legs">
            <Limb styleGuide={this.rightLegStyle()} />
          </div>
          <div className="body-legs">
            <Limb styleGuide={this.leftLegStyle()} />
          </div>
        </div>
      </div>
    );
  }
}
