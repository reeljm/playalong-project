import React, { Component } from 'react'

interface IRepeatProps {
    repeat: number;
    onRepeatChange: (repeat: number) => void
}

export default class Repeat extends Component<IRepeatProps> {

    constructor(props: IRepeatProps) {
        super(props)
    }

    render() {
        return (<>
            <div>
                <label className="settings-label">Repeat</label>
                <div className="button-control decrease" onClick={ (e)=>this.onRepeatInputChange(this.props.repeat-1) }>-</div>
                <input
                    id="repeats"
                    className="number-input"
                    type="number"
                    value={ this.props.repeat }
                    onKeyDown={ (e)=>this.onKeyDown(e) }
                    pattern="\d*"
                />
                <div className="button-control increase" onClick={ (e)=>this.onRepeatInputChange(this.props.repeat+1) }>+</div>
            </div>
        </>);
    }

    onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "ArrowUp") {
            this.onRepeatInputChange(this.props.repeat+1);
        } else if (e.key === "ArrowDown") {
            this.onRepeatInputChange(this.props.repeat-1);
        }
    }

    onRepeatInputChange(tempo: number) {
        this.props.onRepeatChange(tempo);
    }

}