import React, { Component } from 'react';
import { Measure as MeasureData } from '../../src/playbackService/song/measure';
import { Section } from '../../src/playbackService/song/section';
import { Song } from '../../src/playbackService/song/song';
import Measure from './measure';

interface ILeadSheetProps {
    song: Song;
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
                toRender.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/startRepeat.svg`}/>);
            } else {
                toRender.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/doubleBarLine.svg`}/>);
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
                    toRender.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/barLine.svg`}/>);
                }

                // bar line:
                if (lastMeasure && sectionHasEndings && fullLine) {
                    toRender.push(<br/>);
                    toRender.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/barLine.svg`}/>);
                    this.numMeasuresOnLine = 0;
                }

                // new line:
                if (!lastMeasure && fullLine) {
                    toRender.push(<br/>);
                    toRender.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/barLine.svg`}/>);
                    this.numMeasuresOnLine = 0;
                }

                measureIndex++;
            });
            if (!section.isRepeated) {
                toRender.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/doubleBarLine.svg`}/>);
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
                        toRender.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/barLine.svg`}/>);
                    }

                    // new line:
                    if (!lastMeasure && fullLine) {
                        toRender.push(<br/>);
                        toRender.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/barLine.svg`}/>);
                        this.numMeasuresOnLine = 0;
                    }

                    measureIndex++;
                    isFirstMeasure = false;
                });

                if (!section.isRepeated) {
                    toRender.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/doubleBarLine.svg`}/>);
                    toRender.push(<br/>);
                    this.numMeasuresOnLine = 0;
                }

                if (endingIndex + 1 >= section.allEndings.length) {
                    toRender.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/doubleBarLine.svg`}/>);
                    toRender.push(<br/>);
                } else {
                    toRender.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/endRepeat.svg`}/>);
                    toRender.push(<br/>);
                    toRender.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/barLine.svg`}/>);
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
                <div className="lead-sheet">
                    {toRender}
                </div>
            </div>
        );
    }
}
