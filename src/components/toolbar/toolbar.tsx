import React, { Component } from 'react'
import Icon from './icon';

interface IToolbarProps {
    songsMetadata?: any[];
    isPaused?: boolean
    isStopped?: boolean
    onPlay?: () => Promise<void>;
    onPause?: () => void;
    onStop?: () => void;
    onSkipSong?: (delta: number) => Promise<void>;
    onClickSongsList?: () => void;
    onClickSettings?: () => void;
}

interface IToolbarState {
    isPaused?: boolean;
    isStopped?: boolean;
}

export default class Toolbar extends Component<IToolbarProps, IToolbarState> {

    constructor(props:any) {
        super(props);
        this.state = {
            isPaused: this.props.isPaused,
            isStopped: this.props.isStopped
        };
    }

    render() {
        return (
            <>
                <div className="header">
                        <Icon
                            title="List of Songs"
                            onClick={ this.props.onClickSongsList }
                            id="songs"
                            paths={
                                <path fillRule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                            }/>
                        <span className="band-controls">
                            <Icon
                                title="Play"
                                onClick={(e) => {this.onClickPlay()}}
                                id="play"
                                visible={this.props.isPaused || this.props.isStopped}
                                paths={
                                    <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                }/>
                            <Icon
                                title="Pause"
                                onClick={(e) => {this.onClickPause()}}
                                id="pause"
                                visible={!(this.props.isPaused || this.props.isStopped)}
                                paths={
                                    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"/>
                                }/>
                            <Icon
                                title="Stop"
                                onClick={(e) => {this.onClickStop()}}
                                id="stop"
                                paths={
                                    <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5z"/>
                                }/>
                            <Icon
                                title="Previous"
                                onClick={(e) => {this.onClickSkipSong(-1)}}
                                id="skip-start"
                                paths={
                                    <>
                                        <path fillRule="evenodd" d="M4.5 3.5A.5.5 0 0 0 4 4v8a.5.5 0 0 0 1 0V4a.5.5 0 0 0-.5-.5z"/>
                                        <path d="M4.903 8.697l6.364 3.692c.54.313 1.232-.066 1.232-.697V4.308c0-.63-.692-1.01-1.232-.696L4.903 7.304a.802.802 0 0 0 0 1.393z"/>
                                    </>
                                }/>
                            <Icon
                                title="Next"
                                onClick={(e) => {this.onClickSkipSong(1)}}
                                id="skip-end"
                                paths={
                                    <>
                                        <path fillRule="evenodd" d="M12 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z"/>
                                        <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                                    </>
                                }/>
                        </span>
                    <Icon
                        title="Settings"
                        onClick={ this.props.onClickSettings }
                        id="settings-icon"
                        paths={
                            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
                        }/>
                </div>
            </>
        )
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
}
