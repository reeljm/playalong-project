import React, { Component } from 'react'
import { Chord as ChordData } from '../../src/playbackService/theory/chord';
import { Measure as MeasureData } from '../../src/playbackService/song/measure'
import Chord from './chord';

interface IMeasureProps {
    measure: MeasureData;
    endingMarkerNumber?: number;
}

export default class Measure extends Component<IMeasureProps> {
    render() {
        const toRender: JSX.Element[] = [];
        let previousChord: ChordData = null;
        this.props.measure.chords.forEach((c: ChordData) => {
            if (!previousChord || !c.equals(previousChord)) {
                toRender.push(<Chord chord={c}></Chord>);
            }
            previousChord = c;
        });
        return (
            <>
                {
                    this.props.endingMarkerNumber ?
                    <div className="ending-marker-container">
                            <img className="ending-marker" src="./assets/svgs/repeatBracket.svg"/>
                            <img className="ending-marker" src={`./assets/svgs/repeat${this.props.endingMarkerNumber}.svg`}/>
                    </div>
                    : null
                }
                <div className={ this.props.measure.currentlyPlayingMeasure ? "highlighted-measure measure" : "measure"}> { toRender } </div>
            </>
        );
    }
}
