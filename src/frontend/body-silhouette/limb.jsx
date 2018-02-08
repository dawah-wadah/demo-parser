import React from "react";

const Limb = ({ image, classname, width, opacity }) => {
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
        style={Object.assign({},{
            width: "100%",
            height: "100%",
            position: "absolute",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundImage: image.split(".")[0] + "-red.png)",
            opacity,
            transition: "opacity 300ms ease-in"
        })}
      />
        <div
          style={Object.assign({},{
            width: "100%",
            height: "100%",
            position: "absolute",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundImage: image
          })}
        />
    </div>
  );
};

export default Limb;
