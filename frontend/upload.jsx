import React from 'react';

export default class Uploader extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount(){
        console.log("yo")
    }

    render() {
        return (
            <div className="upload-btn-wrapper">
                <button className="btn">Upload a file</button>
                <input type="file" name="myfile" />
            </div>
        )
    }
}