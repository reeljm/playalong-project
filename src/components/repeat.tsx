import React, { ChangeEvent, Component } from 'react'
import ReactDOM from 'react-dom';

interface IRepeatProps {
    repeat: number;
    onRepeatChange: (repeat: number) => void
}

interface IRepeatState {
    showRepeats?: boolean
}

export default class Repeat extends Component<IRepeatProps, IRepeatState> {

    constructor(props: IRepeatProps) {
        super(props)

        this.state = {
            showRepeats: false
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
            this.setState({showRepeats: false});
        }
    }

    render() {
        return (<>
            <div id="repeat-dropdown-container" className="dropdown">
                <span title="Number of Repeats" id="repeat-icon" className="control-icon control-button" onClick={(e)=>this.onClickRepeatIcon()}>
                    <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-arrow-repeat" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
                        <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
                    </svg>
                </span>
                <div id="repeat-dropdown" className={this.state.showRepeats ? "dropdown-content" : "hide"}>
                    <div className="tempo-container">
                        <div id="repeats-decrease" className="button-control decrease" onClick={ (e)=>this.onRepeatButtonClick(-1) }>-</div>
                        <input id="repeats" className="number-input" type="number" value={ this.props.repeat } onChange={ (e)=>this.onRepeatInputChange(e) } min="0" max="400" pattern="\d*" required/>
                        <div id="repeats-increase" className="button-control increase" onClick={ (e)=>this.onRepeatButtonClick(1) }>+</div>
                    </div>
                </div>
            </div>
        </>);
    }

    // Repeat handlers:
    onClickRepeatIcon() {
        this.setState((state:IRepeatState) => {
            return {
                showRepeats: !state.showRepeats
            }
        });
    }

    onRepeatButtonClick(delta: number) {
            let updatedRepeat: number = this.props.repeat;
            updatedRepeat += delta;
            this.props.onRepeatChange(updatedRepeat);
    }

    onRepeatInputChange(e: ChangeEvent<HTMLInputElement>) {
        let updatedRepeat: number = e.target.valueAsNumber ? e.target.valueAsNumber : 0;
        this.props.onRepeatChange(updatedRepeat);
    }

}