import React, { Component } from 'react'
import { BandService } from '../playbackService/band/band.service';
import { Song } from '../playbackService/song/song';
import { Theory } from '../playbackService/theory/theory';
import LeadSheet from './leadSheet';
import Toolbar from "./toolbar";

interface IAppProps {
    band?: BandService;
    songsMetadata?: any[]
    theory?: Theory;
    song?: Song;
}

interface IAppState {
    band?: BandService;
    song?: Song;
    transposingKey?: string;
    isLoading?: boolean;
    showSongsList?: boolean;
}

export default class App extends Component<IAppProps, IAppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            band: this.props.band,
            song: this.props.song,
            transposingKey: "C",
            isLoading: false,
            showSongsList: false
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


    componentDidMount() {
        document.addEventListener("keydown", (e: KeyboardEvent) => e.preventDefault());
        document.addEventListener("keyup", (e: KeyboardEvent) => this.handleSpace(e));
    }

    handleSpace(event: KeyboardEvent) {
        if (event.key !== ' ') {
            return;
        }
        if (this.state.band.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }


    render() {
        return (
            <>
                { this.state.showSongsList ?
                    <div className="songs-list">
                        <h2 className="songs-header">Songs</h2>
                        { this.props.songsMetadata.map((data: any) =>
                            <span key={data._id} onClick={() => this.changeSong(data._id) }>{data.name}</span>)
                        }
                    </div>
                    : "" }
                <Toolbar
                    songsMetadata={ this.props.songsMetadata }
                    tempo={ this.state.band.tempo }
                    repeats={ this.state.band.repeats }
                    currentRepeat={ this.state.band.currentRepeat }
                    transposingKey={ this.state.transposingKey }
                    isPaused={ this.state.band.isPaused }
                    isStopped={ this.state.band.isStopped }
                    onTempoChange={ (tempo: number) => this.updateTempo(tempo) }
                    onClickSongsList={ () => this.toggleSongsList() }
                    onPlay={ () => this.play() }
                    onPause={ () => this.pause() }
                    onStop={ () => this.stop() }
                    onRepeatChange={ (repeat: number) => this.updateRepeat(repeat) }
                    onToggleStyleOverride={
                        (performStyleOverride: boolean, style: string) => this.toggleStyleOverride(performStyleOverride, style)
                    }
                    onChangeStyleOverride={ (style: string) => this.changeStyle(style) }
                    onSkipSong={ async (delta: number) => this.skipSong(delta) }
                    onChangeTransposition={ (key: string) => this.transpose(key) }
                />
                { this.state.isLoading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : null }
                <h1 className="song-name">{ this.state.song.songName }</h1>
                <div className="playback-info">
                    <div className="repeat-number">
                        <b>Repeat Number:</b>{ `${this.state.song.getCurrentIteration() + 1} of ${this.state.song.getTotalIterations()}` }
                    </div>
                </div>
                <LeadSheet song={ this.state.song }></LeadSheet>
            </>
        )
    }

    async play(){
        if (this.state.isLoading) {return}
        this.setState({ isLoading: true });
        await this.state.band.play();
        this.setState((state: IAppState) => {
            return {
                band: state.band,
                isLoading: false
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
            } else if (tempo > 400) {
                tempo = 400;
            }
            state.band.tempo = tempo;
            return {band: state.band};
        });
    }

    updateRepeat(repeat: number) {
        this.setState((state: IAppState) => {
            repeat = Math.max(1, repeat, this.state.band.currentRepeat + 1);
            repeat = Math.min(repeat, 400);
            state.band.repeats = repeat;
            return {band: state.band};
        });
    }

    toggleStyleOverride(performStyleOverride: boolean, style: string) {
        this.setState((state: IAppState) => {
            const band: BandService = state.band;
            band.styleOverride = performStyleOverride;
            if (performStyleOverride) {
                band.setStyle(style);
            } else {
                band.styleOverride = false
            }
            return {
                band: band
            };
        });
    }

    changeStyle(style: string) {
        this.setState((state: IAppState) => {
            state.band.setStyle(style);
            return { band: state.band };
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

}