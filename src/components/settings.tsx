import React, { ChangeEvent, Component } from 'react'
import Transpose from './transpose';

interface ISettingsProps {
    styleOverrideValue: string;
    transposingKey: string;
    onToggleStyleOverride: (performStyleOverride: boolean, style: string) => void;
    onChangeStyleOverride: (style: string) => void;
    onChangeTransposition: (newKey: string) => void;
}

interface ISettingsState {
    showStyleOverrideDropdown?: boolean;
    styleOverrideValue?: string;
}

export default class Settings extends Component<ISettingsProps, ISettingsState> {

    constructor(props: ISettingsProps) {
        super(props)

        this.state = {
            styleOverrideValue: this.props.styleOverrideValue
        }
    }

    render() {
        return (<>
            <div id="settings">
                <div id="settings-dropdown">
                    <Transpose transposingKey={this.props.transposingKey} onChangeTransposition={ this.props.onChangeTransposition } ></Transpose>
                    <div>
                        <span>Style Override</span>
                        <input type="checkbox" id="style-override" onChange={ (e) => this.onToggleStyleOverride(e) }/>
                    </div>
                    <select id="style" className={this.state.showStyleOverrideDropdown ? "style-select": "hide"} onChange={ (e) => this.onChangeStyleOverride(e) } value={this.state.styleOverrideValue}>
                        <option value="fourFourTime">Swing</option>
                        <option value="bossa">Latin</option>
                        <option value="mambo">Mambo</option>
                    </select>
                </div>
            </div>
        </>);
    }

    onToggleStyleOverride(e: ChangeEvent<HTMLInputElement>) {
        this.setState((state:ISettingsState) => {
            const show: boolean = !state.showStyleOverrideDropdown;
            this.props.onToggleStyleOverride(show, state.styleOverrideValue);
            return { showStyleOverrideDropdown: show };
        });
    }

    onChangeStyleOverride(e: ChangeEvent<HTMLSelectElement>) {
        if (this.state.showStyleOverrideDropdown) {
            this.setState({ styleOverrideValue: e.target.value });
            this.props.onChangeStyleOverride(e.target.value);
        }
    }

}