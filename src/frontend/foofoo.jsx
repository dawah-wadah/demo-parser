import React, { Component } from "react";
import Foo from "./foo";

class FooFoo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }
  componentDidMount() {
    let node = window;

    this.setState({
      height: node.clientHeight,
      width: node.clientWidth,
      node
    });
  }

  updateDimensions() {
    let node = this.refs.kd;
    if (node.clientWidth < 500) {
      this.setState({ width: 450, height: 102 });
    } else {
      let update_width = node.clientWidth;
      let update_height = node.clientHeight;
      this.setState({ width: update_width, height: update_height });
    }
    // this.svg.selectAll("*").remove();
    // this.drawShit();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }
  render() {
    let { height, width, node } = this.state;
    if (!height) {return null}
    return (
        <Foo h={height} w={width} bar={node} />
    );
  }
}

export default FooFoo;
