import React from "react";

const Limb = ({ styleGuide, classname, width }) => {
  const parentStyle = () => ({
    width: "100%",
    height: "100%",
    position: "relative",
    display: "flex",
    justifyContent: "center"
  });
  return (
    <div className={classname} style={parentStyle()}>
      <div
        style={Object.assign({}, styleGuide, {
          position: "absolute",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat"
        })}
      />
      <div
        style={Object.assign({}, styleGuide, {
          position: "absolute",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            styleGuide.backgroundImage.split(".")[0] + "-red.png)"
        })}
      />
    </div>
  );
};

export default Limb;

// {/* <div
//   className="body-body"
//   style={{
//     backgroundImage: "url(assets/body2.png)",
//     width: "35%",
//     backgroundRepeat: "no-repeat",
//     height: "100%",
//     backgroundSize: "contain"
//   }}
// />; */}

// <div
//   className="body-body"
//   style={{
//     backgroundImage: "url(assets/right-arm.png)",
//     width: "30%",
//     backgroundRepeat: "no-repeat",
//     height: "90%",
//     backgroundSize: "contain"
//   }}
// />;

        //   <Limb styleGuide={this.armStyle()} classname="body-body" />;
