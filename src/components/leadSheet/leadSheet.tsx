import React, { Component } from 'react';
import { Measure as MeasureData } from '../../playbackService/song/measure';
import { Section } from '../../playbackService/song/section';
import { Song } from '../../playbackService/song/song';
import BarLine from './barLine';
import DoubleBarLine from './doubleBarLine';
import EndRepeat from './endRepeat';
import Measure from './measure';
import StartRepeat from './startRepeat';

interface ILeadSheetProps {
    song: Song;
    loading: boolean;
}

export default class LeadSheet extends Component<ILeadSheetProps> {

    private static SVG_LOCATION: string = "./assets/svgs/";
    private numMeasuresOnLine: number = 0;

    render() {
        this.numMeasuresOnLine = 0;
        let toRender: JSX.Element[] = [];
        this.props.song.sections.forEach((section: Section) => {
            toRender.push(<h2 className="section-header">{section.sectionName}</h2>);
            if (section.isRepeated) {
                toRender.push( <StartRepeat/> );
            } else {
                toRender.push( <DoubleBarLine/> );
            }
            let measureIndex: number = 0;
            section.allMeasures.forEach((measure: MeasureData) => {
                toRender.push(<Measure measure={measure}></Measure>);
                this.numMeasuresOnLine++;

                const lastMeasure: boolean = measureIndex + 1 === section.allMeasures.length;
                const fullLine: boolean = this.numMeasuresOnLine >= 4;
                const sectionHasEndings: boolean = section.allEndings.length > 0;

                // bar line:
                if (!lastMeasure || sectionHasEndings) {
                    toRender.push( <BarLine/> );
                }

                // bar line:
                if (lastMeasure && sectionHasEndings && fullLine) {
                    toRender.push(<br/>);
                    toRender.push( <BarLine/> );
                    this.numMeasuresOnLine = 0;
                }

                // new line:
                if (!lastMeasure && fullLine) {
                    toRender.push(<br/>);
                    toRender.push( <BarLine/> );
                    this.numMeasuresOnLine = 0;
                }

                measureIndex++;
            });
            if (!section.isRepeated) {
                toRender.push( <DoubleBarLine/> );
                toRender.push(<br/>);
                this.numMeasuresOnLine = 0;
            }

            let endingIndex: number = 0;
            section.allEndings.forEach((ending: MeasureData[]) => {
                let isFirstMeasure: boolean = true;
                measureIndex = 0;
                ending.forEach((measure: MeasureData) => {
                    let markerVal: number = null;
                    if (isFirstMeasure) markerVal = endingIndex + 1;
                    toRender.push(<Measure measure={measure} endingMarkerNumber={markerVal}></Measure>);
                    this.numMeasuresOnLine++;

                    const lastMeasure: boolean = measureIndex + 1 === section.allEndings[endingIndex].length;
                    const fullLine: boolean = this.numMeasuresOnLine >= 4;

                    // bar line:
                    if (!lastMeasure) {
                        toRender.push( <BarLine/> );
                    }

                    // new line:
                    if (!lastMeasure && fullLine) {
                        toRender.push(<br/>);
                        toRender.push( <BarLine/> );
                        this.numMeasuresOnLine = 0;
                    }

                    measureIndex++;
                    isFirstMeasure = false;
                });

                if (!section.isRepeated) {
                    toRender.push( <DoubleBarLine/> );
                    toRender.push(<br/>);
                    this.numMeasuresOnLine = 0;
                }

                if (endingIndex + 1 >= section.allEndings.length) {
                    toRender.push( <DoubleBarLine/> );
                    toRender.push(<br/>);
                } else {
                    toRender.push( <EndRepeat/> );
                    toRender.push(<br/>);
                    toRender.push( <BarLine/> );
                }
                this.numMeasuresOnLine = 0;

                endingIndex++;
            });
        });
        return (
            <div className="main-section">
                <h1 className="song-name">{ this.props.song.songName }</h1>
                <div className="playback-info">
                    <div className="repeat-number">
                        <b>Repeat Number:</b>{ `${this.props.song.getCurrentIteration() + 1} of ${this.props.song.getTotalIterations()}` }
                    </div>
                </div>
                {this.props.loading && <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>}
                <div className="lead-sheet">
                    {toRender}
                </div>
            </div>
        );
    }
}
