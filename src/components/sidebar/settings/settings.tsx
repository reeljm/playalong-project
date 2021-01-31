import React, { ChangeEvent, Component } from 'react'
import { Instrument } from '../../../playbackService/musicians/instrument';
import Repeat from './repeat';
import Tempo from './tempo';
import Transpose from './transpose';

interface ISettingsProps {
    styleOverrideValue: string;
    showStyleOverride: boolean;
    transposingKey: string;
    tempo: number;
    repeats?: number;
    currentRepeat?: number;
    instruments: Instrument[];
    onTempoChange: (tempo: number) => void;
    onToggleStyleOverride: (performStyleOverride: boolean) => void;
    onChangeStyleOverride: (style: string) => void;
    onChangeTransposition: (newKey: string) => void;
    onRepeatChange?: (repeat: number) => void;
}

interface ISettingsState {
    instruments: Instrument[];
}


export default class Settings extends Component<ISettingsProps, ISettingsState> {

    constructor(props: ISettingsProps) {
        super(props);
        this.state = {
            instruments: this.props.instruments
        };
    }

    render() {
        return (<>
            <div className="right-sidebar">
                <h4>Settings</h4>
                <Transpose
                    transposingKey={this.props.transposingKey}
                    onChangeTransposition={ this.props.onChangeTransposition }
                />
                <div>
                    <label className="settings-label">Style Override</label>
                    <input
                        type="checkbox"
                        checked={this.props.showStyleOverride}
                        id="style-override"
                        onChange={ (e) => this.props.onToggleStyleOverride(!this.props.showStyleOverride) }
                    />
                    {
                        this.props.showStyleOverride &&
                        <select
                            className="style-select"
                            onChange={ (e) => this.onChangeStyleOverride(e) }
                            value={this.props.styleOverrideValue}
                        >
                            <option value="fourFourTime">Swing</option>
                            <option value="bossa">Latin</option>
                            <option value="mambo">Mambo</option>
                        </select>
                    }
                </div>
                <Tempo tempo={this.props.tempo} onTempoChange={ this.props.onTempoChange }/>
                <Repeat repeat={this.props.repeats} onRepeatChange={ this.props.onRepeatChange }  />
                <h5>Mixer</h5>
                {
                    this.state.instruments.map((inst: Instrument) =>
                        <div className="mixer-line">
                            <label className="settings-label">{inst.instrumentName}</label>
                            <input
                                className="slider"
                                step="0.1"
                                type="range"
                                min={Instrument.VOLUME_MIN}
                                max={Instrument.VOLUME_MAX}
                                value={inst.volume}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    this.setState((state: ISettingsState) => {
                                        const instInArray: Instrument = state.instruments.find((instInArray: Instrument) =>
                                            instInArray.instrumentName === inst.instrumentName
                                        );
                                        instInArray.volume = e.target.valueAsNumber;
                                        return {
                                            instruments: state.instruments
                                        };
                                    });
                                }}
                            />
                        </div>
                    )
                }
            </div>
        </>);
    }

    onChangeStyleOverride(e: ChangeEvent<HTMLSelectElement>) {
        this.props.onChangeStyleOverride(e.target.value);
    }
}