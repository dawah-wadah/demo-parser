import React, { Component } from "react";
import firebase from "firebase";

class Uploader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pg: 0
    }

    this.uploadFile = this.uploadFile.bind(this);
  }

  componentDidMount() {

  }

  uploadFile(e) {
    const file = e.target.files[0];
    const ar = file.name.split('.');
    console.log(ar[ar.length - 1])
    const storageRef = firebase.storage().ref(file.name);
    // storageRef.child(file.name);
    const task = storageRef.put(file);
    task.on('state_changed',
      (snapshot) => {
        const pr = snapshot.bytesTransferred / snapshot.totalBytes * 100;
        this.setState({ pg: pr })
        console.log(pr)
      },
      (err) => {
        console.log(err);
      },
      (complete) => {
        this.setState({ pg: 0 })
      }
      )
  }

  render() {
    return (
      <div id="uploader">
        <progress value={this.state.pg} max="100">0%</progress>
        <input type="file" value="" onChange={this.uploadFile}></input>
      </div>
    );
  }
}

export default Uploader;
