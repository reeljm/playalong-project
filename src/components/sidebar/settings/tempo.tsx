import React, { Component } from 'react'

interface TempoProps {
    tempo: number;
    onTempoChange: (tempo: number) => void
}

export default class Tempo extends Component<TempoProps> {

    constructor(props: TempoProps) {
        super(props)
    }

    render() {
        return (
            <div>
                <label className="settings-label">Tempo (BPM)</label>
                <div className="button-control decrease" onClick={() => this.props.onTempoChange(this.props.tempo - 1)}>-</div>
                    <input
                        id="tempo"
                        className="number-input"
                        type="number"
                        value={ this.props.tempo }
                        onChange={(e) => this.props.onTempoChange(e.target.valueAsNumber)}
                        pattern="\d*"
                    />
                <div className="button-control increase" onClick={() => this.props.onTempoChange(this.props.tempo + 1)}>+</div>
            </div>
        );
    }
}
