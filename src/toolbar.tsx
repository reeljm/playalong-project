import React, { ChangeEvent, Component } from 'react'
import { BandService } from './playbackService/band/band.service'

interface IToolbarProps {
    band?: BandService;
}

interface IToolbarState {
    band?: BandService;
    showTempo?: boolean;
    showVideo?: boolean;
    showVideoSuggestion?: boolean;
    showTransposition?: boolean;
    showStyleOverrideDropdown?: boolean;
    styleOverrideValue?: string;
    showRepeats?: boolean;
}

export default class Toolbar extends Component<IToolbarProps, IToolbarState> {
    constructor(props:any) {
        super(props);
        this.state = {
            band: this.props.band,
            showTempo: false,
            showVideo: false,
            showVideoSuggestion: localStorage.getItem("viewedVideos")!="true",
            showTransposition: false,
            showStyleOverrideDropdown: false,
            styleOverrideValue: "fourFourTime",
            showRepeats: false
        };
    }

    render() {
        return (
            <>
                <div id="header">
                    <div className="playback-container">
                        <span title="Videos" id="videos" className="control-button" onClick={(e)=>this.onClickVideos()}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-info" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
                                <circle cx="8" cy="4.5" r="1"/>
                            </svg>
                            <div id="info-dropdown-message" className={ this.state.showVideoSuggestion ? "info-content" : "hide" }>
                                <span className="info-dropdown-arrow"></span>
                                <span className="info-dropdown-inner-content">First time here? Click above to learn more about the playalong project!</span>
                            </div>
                        </span>
                        <span title="List of Songs" id="songs" className="control-button">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-list" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                            </svg>
                        </span>
                        <div className="vl"></div>
                        <span title="Play" id="play" className={this.state.band.isPaused || this.state.band.isStopped ? "control-button" : "hidden"} onClick={(e) => {this.onClickPlay()}}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-play-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
                            </svg>
                        </span>
                        <span title="Pause" id="pause" className={this.state.band.isPlaying ? "control-button" : "hidden"} onClick={(e) => {this.onClickPause()}}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-pause-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                            </svg>
                        </span>
                        <span title="Stop" id="stop" className="control-button" onClick={(e) => {this.onClickStop()}}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-stop" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M3.5 5A1.5 1.5 0 0 1 5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5zM5 4.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5H5z"/>
                            </svg>
                        </span>
                        <span title="Previous" id="skip-start" className="control-button">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-start-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M4.5 3.5A.5.5 0 0 0 4 4v8a.5.5 0 0 0 1 0V4a.5.5 0 0 0-.5-.5z"/>
                                <path d="M4.903 8.697l6.364 3.692c.54.313 1.232-.066 1.232-.697V4.308c0-.63-.692-1.01-1.232-.696L4.903 7.304a.802.802 0 0 0 0 1.393z"/>
                            </svg>
                        </span>
                        <span title="Next" id="skip-end" className="control-button">
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-skip-end-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M12 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                                <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                            </svg>
                        </span>
                    </div>
                    <div className="vl"></div>
                    <div id="tempo-dropdown-container" className="dropdown">
                        <span title="Tempo" id="tempo-icon" className="control-icon control-button" unselectable="on" onClick={(e)=>this.onClickTempoIcon()}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-stopwatch" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M6 .5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H9v1.07A7.001 7.001 0 0 1 8 16 7 7 0 0 1 7 2.07V1h-.5A.5.5 0 0 1 6 .5zM8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3zm0 2.1a.5.5 0 0 1 .5.5V9a.5.5 0 0 1-.5.5H4.5a.5.5 0 0 1 0-1h3V5.6a.5.5 0 0 1 .5-.5z"/>
                            </svg>
                        </span>
                        <div id="tempo-dropdown" className={ this.state.showTempo ? "dropdown-content" : "hide" }>
                            <div className="tempo-container">
                                <div id="tempo-decrease" className="button-control decrease" onClick={ (e)=>this.onTempoButtonClick(-1) }>-</div>
                                <input id="tempo" className="number-input" type="number" value={ this.state.band.tempo } onChange={ (e)=>this.onTempoInputChange(e) } pattern="\d*"/>
                                <div id="tempo-increase" className="button-control increase" onClick={ (e)=>this.onTempoButtonClick(1) }>+</div>
                            </div>
                        </div>
                    </div>
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
                                <input id="repeats" className="number-input" type="number" value={ this.state.band.repeats } onChange={ (e)=>this.onRepeatInputChange(e) } min="0" max="400" pattern="\d*" required/>
                                <div id="repeats-increase" className="button-control increase" onClick={ (e)=>this.onRepeatButtonClick(1) }>+</div>
                            </div>
                        </div>
                    </div>
                    <div id="transpose-dropdown-container" className="dropdown">
                        <span title="Transpose" id="transpose-icon" className="control-icon control-button" onClick={(e)=>this.onClickTransposition()}>
                            <img className="transpose-icon" src="./assets/svgs/transpose.svg"/>
                        </span>
                        <div id="transpose-dropdown" className={this.state.showTransposition ? "dropdown-content" : "hide"}>
                            <div className="transpose-container">
                                <div id="transpose-Bb" className="button-control">Bb</div>
                                <div id="transpose-C" className="button-control">C</div>
                                <div id="transpose-Eb" className="button-control">Eb</div>
                            </div>
                        </div>
                    </div>
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

    // Repeat handlers:
    onClickRepeatIcon() {
        this.setState((state:IToolbarState) => {
            return {
                showRepeats: !state.showRepeats
            }
        });
    }

    onRepeatButtonClick(delta: number) {
        this.setState((state:IToolbarState) => {
            let updatedRepeats: number = state.band.repeats;
            updatedRepeats += delta;
            updatedRepeats = Math.max(1, updatedRepeats, state.band.currentRepeat + 1);
            updatedRepeats = Math.min(updatedRepeats, 400);

            const band: BandService = state.band;
            band.repeats = updatedRepeats;
            return { band: band };
        });
    }

    onRepeatInputChange(e: ChangeEvent<HTMLInputElement>) {
        this.setState((state:IToolbarState) => {
            let updatedRepeat: number = e.target.valueAsNumber ? e.target.valueAsNumber : 0;
            updatedRepeat = Math.max(1, updatedRepeat, state.band.currentRepeat + 1);
            updatedRepeat = Math.min(updatedRepeat, 400);
            const updatedBand: BandService = state.band;
            updatedBand.repeats = updatedRepeat;
            return { band: updatedBand };
        });
    }

    // Transposition handlers:
    onClickTransposition() {
        this.setState((state:IToolbarState) => {
            return {
                showTransposition: !state.showTransposition
            }
        });
    }

    // Video handlers:
    onClickVideos() {
        this.setState((state:IToolbarState) => {
            localStorage.setItem("viewedVideos", "true");
            return {
                showVideo: !state.showVideo,
                showVideoSuggestion: false
            }
        });
    }

    // Tempo handlers:
    onClickTempoIcon() {
        this.setState((state:IToolbarState) => {
            return {
                showTempo: !state.showTempo
            }
        });
    }

    onTempoInputChange(e: ChangeEvent<HTMLInputElement>) {
        this.setState((state:IToolbarState) => {
            let updatedTempo: number = e.target.valueAsNumber
            if (!updatedTempo || updatedTempo < 0) {
                updatedTempo = 0;
            } else if (updatedTempo > 400) {
                updatedTempo = 400;
            }
            const updatedBand: BandService = state.band;
            updatedBand.tempo = updatedTempo;
            return { band: updatedBand };
        });
    }

    onTempoButtonClick(delta: number) {
        this.setState((state:IToolbarState) => {
            let updatedTempo: number = state.band.tempo;
            updatedTempo+=delta;

            console.log('b', updatedTempo);
            if (!updatedTempo || updatedTempo < 0) {
                updatedTempo = 0;
            } else if (updatedTempo > 400) {
                updatedTempo = 400;
            }
            console.log('a', updatedTempo);

            const updatedBand: BandService = state.band;
            updatedBand.tempo = updatedTempo;
            return { band: updatedBand };
        });
    }

    // Style override handlers:
    onClickStyleOverride(e: ChangeEvent<HTMLInputElement>) {
        this.setState((state:IToolbarState) => {
            const styleOverride: boolean = !state.showStyleOverrideDropdown;
            const band: BandService = state.band;
            band.styleOverride = styleOverride;
            if (styleOverride) {
                band.setStyle(this.state.styleOverrideValue);
            } else {
                band.styleOverride = false
            }
            return {
                showStyleOverrideDropdown: styleOverride,
                band: band
            };
        });
    }

    onChangeStyleOverrideSelect(e: ChangeEvent<HTMLSelectElement>) {
        if (this.state.showStyleOverrideDropdown) {
            this.setState((state: IToolbarState) => {
                const band: BandService = state.band;
                band.setStyle(e.target.value);
                return {
                    styleOverrideValue: e.target.value,
                    band: band
                };
            });
        }
    }

    // Player control handlers:
    async onClickPlay() {
        await this.state.band.play();
        this.setState((state: IToolbarState) => {
            return {band: state.band};
        });
    }

    onClickPause() {
        this.state.band.pause();
        this.setState((state: IToolbarState) => {
            return {band: state.band};
        });
    }

    onClickStop() {
        this.state.band.stop();
        this.setState((state: IToolbarState) => {
            return {band: state.band};
        });
    }
}
