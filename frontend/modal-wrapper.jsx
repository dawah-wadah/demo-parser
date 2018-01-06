import React, {Component} from 'react';

class ModalWrapper extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: false
        }
    }

    openModal() {
        this.setState({
            open: !this.state.open
        })
    }
    render() {
        return (
            <div></div>
        );
    }
}

export default ModalWrapper;