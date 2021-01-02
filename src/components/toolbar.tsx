import React, { ChangeEvent, Component } from 'react'
import Repeat from './repeat';
import Tempo from './tempo';
import Transpose from './transpose';

interface IToolbarProps {
    songsMetadata?: any[];
    tempo?: number;
    repeats?: number;
    currentRepeat?: number;
    transposingKey?: string;
    isPaused?: boolean
    isStopped?: boolean
    onTempoChange?: (tempo: number) => void;
    onRepeatChange?: (repeat: number) => void;
    onPlay?: () => Promise<void>;
    onPause?: () => void;
    onStop?: () => void;
    onToggleStyleOverride?: (performStyleOverride: boolean, style: string) => void;
    onChangeStyleOverride?: (style: string) => void;
    onSkipSong?: (delta: number) => Promise<void>;
    onChangeTransposition?: (key: string) => void;
    onClickSongsList?: () => void;
}

interface IToolbarState {
    showTempo?: boolean;
    showVideo?: boolean;
    showVideoSuggestion?: boolean;
    showTransposition?: boolean;
    showStyleOverrideDropdown?: boolean;
    styleOverrideValue?: string;
    showRepeats?: boolean;
    isPaused?: boolean;
    isStopped?: boolean;
}

export default class Toolbar extends Component<IToolbarProps, IToolbarState> {

    constructor(props:any) {
        super(props);
        this.state = {
            showTempo: false,
            showVideo: false,
            showVideoSuggestion: localStorage.getItem("viewedVideos")!="true",
            showTransposition: false,
            showStyleOverrideDropdown: false,
            styleOverrideValue: "fourFourTime",
            showRepeats: false,
            isPaused: this.props.isPaused,
            isStopped: this.props.isStopped
        };
    }

    render() {
        return (
            <>
                <div id="header">
                    <div className="playback-container">
                        <span title="List of Songs" id="songs" className="control-button" onClick={(e) => {this.onClickSongsList()}}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-list" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                        </span>
                        <div className="vl"></div>
                        <span title="Play" id="play" className={this.props.isPaused || this.props.isStopped ? "control-button" : "hidden"} onClick={(e) => {this.onClickPlay()}}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-play-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                            </svg>
                        </span>
                        <span title="Pause" id="pause" className={!(this.props.isPaused || this.props.isStopped) ? "control-button" : "hidden"} onClick={(e) => {this.onClickPause()}}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pause-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                            </svg>
                        </span>
                        <span title="Stop" id="stop" className="control-button" onClick={(e) => {this.onClickStop()}}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-stop" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M3.5 5A1.5 1.5 0 0 1 5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5zM5 4.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5H5z"/>
                            </svg>
                        </span>
                        <span title="Previous" id="skip-start" className="control-button" onClick={(e) => {this.onClickSkipSong(-1)}}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-start-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.5 3.5A.5.5 0 0 0 4 4v8a.5.5 0 0 0 1 0V4a.5.5 0 0 0-.5-.5z"/>
                                <path d="M4.903 8.697l6.364 3.692c.54.313 1.232-.066 1.232-.697V4.308c0-.63-.692-1.01-1.232-.696L4.903 7.304a.802.802 0 0 0 0 1.393z"/>
                            </svg>
                        </span>
                        <span title="Next" id="skip-end" className="control-button" onClick={(e) => {this.onClickSkipSong(1)}}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-end-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M12 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                                <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                            </svg>
                        </span>
                    </div>
                    <div className="vl"></div>
                    <Tempo tempo={ this.props.tempo } onTempoChange={ this.props.onTempoChange }></Tempo>
                    <Repeat repeat={ this.props.repeats } onRepeatChange={ this.props.onRepeatChange }></Repeat>
                    <Transpose transposingKey={'C'} onChangeTransposition={ this.props.onChangeTransposition } ></Transpose>
                    <div title="Style" className="style-container">
                        <div>
                            <span>Style Override</span>
                            <input type="checkbox" id="style-override" onChange={(e)=>this.onClickStyleOverride(e)}/>
                        </div>
                        <select id="style" className={this.state.showStyleOverrideDropdown ? "style-select": "hide"} onChange={(e)=>this.onChangeStyleOverrideSelect(e)} value={this.state.styleOverrideValue}>
                            <option value="fourFourTime">Swing</option>
                            <option value="bossa">Latin</option>
                            <option value="mambo">Mambo</option>
                        </select>
                    </div>
                </div>
                <div className={ this.state.showVideo ? "video-container" : "hide" }  >
                    <iframe id="how-to" width="560" height="315" src={ process.env.HOW_TO_VIDEO_URL + "?origin=" + process.env.PLAYALONG_URL } allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                </div>
            </>
        )
    }

    // Style override handlers:
    onClickStyleOverride(e: ChangeEvent<HTMLInputElement>) {
        this.setState((state:IToolbarState) => {
            const show: boolean = !state.showStyleOverrideDropdown;
            this.props.onToggleStyleOverride(show, state.styleOverrideValue);
            return { showStyleOverrideDropdown: show };
        });
    }

    onChangeStyleOverrideSelect(e: ChangeEvent<HTMLSelectElement>) {
        if (this.state.showStyleOverrideDropdown) {
            this.setState({ styleOverrideValue: e.target.value });
            this.props.onChangeStyleOverride(e.target.value);
        }
    }

    // Player control handlers:
    async onClickPlay() {
        this.setState({
            isPaused: false,
            isStopped: false,
        })
        this.props.onPlay();
    }

    onClickPause() {
        this.setState({
            isPaused: true,
            isStopped: false,
        })
        this.props.onPause();
    }

    onClickStop() {
        this.setState({
            isPaused: false,
            isStopped: true,
        })
        this.props.onStop();
    }

    async onClickSkipSong(delta: number) {
        this.props.onSkipSong(delta);
        this.setState({
            isPaused: false,
            isStopped: true
        });
    }

    onClickSongsList() {
        this.props.onClickSongsList();
    }
}
