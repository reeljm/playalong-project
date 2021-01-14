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
                <div className="button-control decrease" onClick={(e)=>this.props.onRepeatChange(this.props.repeat - 1)}>-</div>
                <input
                    id="repeats"
                    className="number-input"
                    type="number"
                    value={ this.props.repeat }
                    onChange={(e) => this.props.onRepeatChange(e.target.valueAsNumber - e.target.valueAsNumber % 1)}
                    pattern="\d*"
                />
                <div className="button-control increase" onClick={(e)=>this.props.onRepeatChange(this.props.repeat + 1)}>+</div>
            </div>
        </>);
    }


}