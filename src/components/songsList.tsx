import React, { Component } from 'react'

interface ISongsListProps {
    onSongClick: (songId: string) => void;
    songsMetadata: any[];
    showSongsList: boolean;
}

export default class SongsList extends Component<ISongsListProps> {

    constructor(props: ISongsListProps) {
        super(props);
    }

    render() {
        return (
            <div className="left-sidebar">
                <h2 className="songs-header">Songs</h2>
                { this.props.songsMetadata.map((data: any) =>
                    <h3 key={data._id} onClick={() => this.props.onSongClick(data._id) }>{data.name}</h3>)
                }
            </div>
        );
    }

}