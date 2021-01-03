import React, { ChangeEvent, Component } from 'react'
import ReactDOM from 'react-dom';

interface TempoProps {
    tempo: number;
    onTempoChange: (tempo: number) => void
}

interface TempoState {
    showTempo?: boolean
}

export default class Tempo extends Component<TempoProps, TempoState> {

    constructor(props: TempoProps) {
        super(props)

        this.state = {
            showTempo: false
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
            this.setState({showTempo: false});
        }
    }

    render() {
        return (<>
            <div id="tempo-dropdown-container" className="dropdown">
                <span title="Tempo" id="tempo-icon" className="control-icon control-button" unselectable="on" onClick={(e)=>this.onClickTempoIcon()}>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-stopwatch" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07A7.001 7.001 0 0 1 8 16 7 7 0 0 1 7 2.07V1h-.5A.5.5 0 0 1 6 .5zM8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3zm0 2.1a.5.5 0 0 1 .5.5V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                </span>
                <div id="tempo-dropdown" className={ this.state.showTempo ? "dropdown-content" : "hide" }>
                    <div className="tempo-container">
                        <div id="tempo-decrease" className="button-control decrease" onClick={ (e)=>this.onTempoButtonClick(-1) }>-</div>
                        <input id="tempo" className="number-input" type="number" value={ this.props.tempo } onChange={ (e)=>this.onTempoInputChange(e) } pattern="\d*"/>
                        <div id="tempo-increase" className="button-control increase" onClick={ (e)=>this.onTempoButtonClick(1) }>+</div>
                    </div>
                </div>
            </div>
        </>);
    }


    onClickTempoIcon() {
        this.setState((state:TempoState) => {
            return {
                showTempo: !state.showTempo
            }
        });
    }

    onTempoInputChange(e: ChangeEvent<HTMLInputElement>) {
        let updatedTempo: number = e.target.valueAsNumber
        this.props.onTempoChange(updatedTempo);
    }

    onTempoButtonClick(delta: number) {
        let updatedTempo: number = this.props.tempo;
        updatedTempo+=delta;
        this.props.onTempoChange(updatedTempo);
    }

}
