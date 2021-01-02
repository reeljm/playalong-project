import React, { Component } from 'react'
import ReactDOM from 'react-dom';

interface ITransposeProps {
    transposingKey: string,
    onChangeTransposition: (newKey: string) => void
}

interface ITransposeState {
    showTransposition?: boolean
}

export default class Transpose extends Component<ITransposeProps, ITransposeState> {

    constructor(props: ITransposeProps) {
        super(props)

        this.state = {
            showTransposition: false
        }
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = (event: any) => {
        const currentNode: Node = ReactDOM.findDOMNode(this);
        if (!currentNode || !currentNode.contains(event.target)) {
            this.setState({showTransposition: false});
        }
    }

    render() {
        return (<>
            <div id="transpose-dropdown-container" className="dropdown">
                <span title="Transpose" id="transpose-icon" className="control-icon control-button" onClick={(e)=>this.onClickTransposition()}>
                    <img className="transpose-icon" src="./assets/svgs/transpose.svg"/>
                </span>
                <div id="transpose-dropdown" className={this.state.showTransposition ? "dropdown-content" : "hide"}>
                    <div className="transpose-container">
                        <div id="transpose-Bb" className={this.props.transposingKey==="Bb" ? "button-control selected-transposing-key" : "button-control"} onClick={(e)=>this.onClickTranspositionValue("Bb")}>Bb</div>
                        <div id="transpose-C" className={this.props.transposingKey==="C" ? "button-control selected-transposing-key" : "button-control"} onClick={(e)=>this.onClickTranspositionValue("C")}>C</div>
                        <div id="transpose-Eb" className={this.props.transposingKey==="Eb" ? "button-control selected-transposing-key" : "button-control"} onClick={(e)=>this.onClickTranspositionValue("Eb")}>Eb</div>
                    </div>
                </div>
            </div>
        </>);
    }

        // Transposition handlers:
        onClickTransposition() {
            this.setState((state:ITransposeState) => {
                return {
                    showTransposition: !state.showTransposition
                }
            });
        }

        onClickTranspositionValue(key: string) {
            this.props.onChangeTransposition(key);
        }

}