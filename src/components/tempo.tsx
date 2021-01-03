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
                <div className="button-control decrease" onClick={ (e)=>this.onTempoInputChange(this.props.tempo-1) }>-</div>
                    <input
                        id="tempo"
                        className="number-input"
                        type="number"
                        value={ this.props.tempo }
                        onKeyDown={ (e)=>this.onKeyDown(e) }
                        pattern="\d*"
                    />
                <div className="button-control increase" onClick={ (e)=>this.onTempoInputChange(this.props.tempo+1) }>+</div>
            </div>
        );
    }

    onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "ArrowUp") {
            this.onTempoInputChange(this.props.tempo+1);
        } else if (e.key === "ArrowDown") {
            this.onTempoInputChange(this.props.tempo-1);
        }
    }

    onTempoInputChange(tempo: number) {
        this.props.onTempoChange(tempo);
    }

}
