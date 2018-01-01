import React from "react";

export default class ResizableTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
    };
  }

  resize() {
    let width = this.state.width ? 0 : "40%";
    this.setState({ width });
  }

  render() {
    return (
      <div className="resize-parent">
        <button onClick={this.resize.bind(this)}>Resize</button>
        <div className="flex full">
          <div className="resize-child first">
              {this.props.component[0]}
          </div>
          <div className="resize-child second" style={this.state}>
              {this.props.component[1]}
          </div>
        </div>
      </div>
    );
  }
}
