import React, { Component } from 'react'
import { Chord as ChordData } from '../../playbackService/theory/chord';
import { Measure as MeasureData } from '../../playbackService/song/measure'
import Chord from './chord';
import RepeatBracket from './repeatBracket';

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
                    this.props.endingMarkerNumber &&
                    <RepeatBracket repeatNumber={this.props.endingMarkerNumber}/>
                }
                <div className={ `measure ${this.props.measure.currentlyPlayingMeasure && "highlighted-measure"}`}> { toRender } </div>
            </>
        );
    }
}
