import React, { Component } from 'react'
import { Instrument } from '../../playbackService/musicians/instrument';
import { BandService } from '../../playbackService/band/band.service';
import { Song } from '../../playbackService/song/song';
import { Theory } from '../../playbackService/theory/theory';
import LeadSheet from '../leadSheet/leadSheet';
import Settings from '../sidebar/settings/settings';
import SongsList from '../sidebar/songsList';
import Toolbar from "../toolbar/toolbar";

interface IAppProps {
    band?: BandService;
    songsMetadata?: any[];
    theory?: Theory;
    song?: Song;
    instruments: Instrument[];
}

interface IAppState {
    band?: BandService;
    song?: Song;
    transposingKey?: string;
    loading?: boolean;
    showSongsList?: boolean;
    showSettings?: boolean;
    styleOverrideValue?: string;
    showStyleOverride?: boolean;
}

export default class App extends Component<IAppProps, IAppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            band: this.props.band,
            song: this.props.song,
            transposingKey: "C",
            styleOverrideValue: "fourFourTime",
            loading: false,
            showSongsList: false,
            showSettings: false,
            showStyleOverride: false,
        };

        this.state.band.setNewMeasureCallback(() => {
            this.setState((state: IAppState) => {
                return {
                    song: state.song,
                    band: state.band
                };
            })
        });
    }

    render() {
        return (
            <div className="parent">
                <Toolbar
                    songsMetadata={ this.props.songsMetadata }
                    isPaused={ this.state.band.isPaused }
                    isStopped={ this.state.band.isStopped }
                    onClickSongsList={ () => this.toggleSongsList() }
                    onPlay={ () => this.play() }
                    onPause={ () => this.pause() }
                    onStop={ () => this.stop() }
                    onSkipSong={ async (delta: number) => this.skipSong(delta) }
                    onClickSettings={ () => { this.toggleSettings() } }
                    />
                { this.state.showSongsList &&
                    <SongsList
                        songsMetadata={this.props.songsMetadata}
                        showSongsList={ this.state.showSongsList }
                        onSongClick={ (songID: string) => this.changeSong(songID) }
                    />}
                <LeadSheet song={ this.state.song } loading={ this.state.loading }/>
                { this.state.showSettings &&
                    <Settings
                        styleOverrideValue={ this.state.styleOverrideValue }
                        showStyleOverride={ this.state.showStyleOverride }
                        transposingKey={ this.state.transposingKey }
                        repeats={ this.state.band.repeats }
                        currentRepeat={ this.state.band.currentRepeat }
                        tempo={ this.state.band.tempo }
                        onToggleStyleOverride={ (performStyleOverride: boolean) => this.toggleStyleOverride(performStyleOverride) }
                        onChangeStyleOverride={ (style: string) => this.changeStyle(style) }
                        onChangeTransposition={ (key: string) => this.transpose(key) }
                        onTempoChange={ (tempo: number) => this.updateTempo(tempo) }
                        onRepeatChange={ (repeat: number) => this.updateRepeat(repeat) }
                        instruments={ this.props.instruments }
                    />
                }
            </div>
        )
    }

    // Event handlers:
    async play(){
        if (this.state.loading) {return}
        this.setState({ loading: true });
        await this.state.band.play();
        this.setState((state: IAppState) => {
            return {
                band: state.band,
                loading: false
            };
        });
    }

    pause() {
        this.state.band.pause();
        this.setState((state: IAppState) => {
            return {band: state.band};
        });
    }

    stop() {
        this.state.band.stop();
        this.setState((state: IAppState) => {
            return {band: state.band};
        });
    }

    updateTempo(tempo: number) {
        this.setState((state: IAppState) => {
            if (!tempo || tempo < 0) {
                tempo = 0;
            } else if (tempo > 1000) {
                tempo = 1000;
            }
            state.band.tempo = tempo;
            return {band: state.band};
        });
    }

    updateRepeat(repeat: number) {
        this.setState((state: IAppState) => {
            repeat = Number.isNaN(repeat) ? 0: Math.trunc(repeat);
            repeat = Math.max(1, repeat, this.state.band.currentRepeat + 1);
            repeat = Math.min(repeat, 400);
            state.band.repeats = repeat;
            return {band: state.band};
        });
    }

    toggleStyleOverride(performStyleOverride: boolean) {
        this.setState((state: IAppState) => {
            const band: BandService = state.band;
            band.styleOverride = performStyleOverride;
            if (performStyleOverride) {
                band.setStyle(state.styleOverrideValue);
            } else {
                band.styleOverride = false
            }
            return {
                band: band,
                showStyleOverride: performStyleOverride
            };
        });
    }

    changeStyle(style: string) {
        this.setState((state: IAppState) => {
            state.band.setStyle(style);
            return {
                band: state.band,
                styleOverrideValue: style
            };
        });
    }

    async skipSong(delta: number) {
        let songIndex: number = 0;
        for (var i = 0; i < this.props.songsMetadata.length; i++) {
            if (this.props.songsMetadata[i]._id == this.state.song.id) {
                songIndex = i;
                break;
            }
        }
        songIndex = (songIndex + delta) % this.props.songsMetadata.length;
        if (songIndex < 0) {
            songIndex = this.props.songsMetadata.length-1;
        } else if (songIndex >= this.props.songsMetadata.length) {
            songIndex = 0;
        }

        this.changeSong(this.props.songsMetadata[songIndex]._id);
    }

    async changeSong(songId: string) {
        this.state.band.stop();
        const songDataURI: string = `${process.env.BACKEND_API}/songs/id/${songId}`;
        const res: Response = await fetch(songDataURI);
        const songData: any = await res.json();
        const songToPlay: Song = new Song(this.props.theory);
        songToPlay.deserialize(songData);
        songToPlay.transposeDisplayedChords(this.state.transposingKey);

        this.setState((state: IAppState) => {
            const band: BandService = state.band;
            band.setSong(songToPlay);
            band.tempo = songToPlay.songTempo;
            return {
                song: songToPlay,
                band: band
            };
        });
    }

    transpose(key: string) {
        this.setState((state: IAppState) => {
            state.song.transposeDisplayedChords(key);
            return {
                song: state.song,
                transposingKey: key
            };
        });
    }

    toggleSongsList() {
        this.setState((state: IAppState) => {
            return { showSongsList: !state.showSongsList }
        });
    }

    toggleSettings() {
        this.setState((state: IAppState) => {
            return { showSettings: !state.showSettings }
        });
    }
}