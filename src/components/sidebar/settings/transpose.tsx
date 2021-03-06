import React, { Component } from 'react'

interface ITransposeProps {
    transposingKey: string,
    onChangeTransposition: (newKey: string) => void
}

interface ITransposeState {
    transposingKey: string
}

export default class Transpose extends Component<ITransposeProps, ITransposeState> {

    constructor(props: ITransposeProps) {
        super(props);
        this.state = { transposingKey: this.props.transposingKey };
    }

    render() {
        return (<>
            <div>
                <label className="settings-label">Transposing Key</label>
                <div id="transpose-Bb" className={`button-control ${this.state.transposingKey==="Bb" && "selected-transposing-key"}`} onClick={(e)=>this.onClickTranspositionValue("Bb")}><span className="button-text">Bb</span></div>
                <div id="transpose-C" className={`button-control ${this.state.transposingKey==="C" && "selected-transposing-key"}`} onClick={(e)=>this.onClickTranspositionValue("C")}><span className="button-text">C</span></div>
                <div id="transpose-Eb" className={`button-control ${this.state.transposingKey==="Eb" && "selected-transposing-key"}`} onClick={(e)=>this.onClickTranspositionValue("Eb")}><span className="button-text">Eb</span></div>
            </div>
        </>);
    }

    onClickTranspositionValue(key: string) {
        this.props.onChangeTransposition(key);
        this.setState({transposingKey: key});
    }

}