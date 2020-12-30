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
            if (section.isRepeated) {
                toRender.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/startRepeat.svg`}/>);
            } else {
                toRender.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/doubleBarLine.svg`}/>);
            }
            section.allMeasures.forEach((measure: MeasureData) => {
                toRender = toRender.concat(this.createMeasure(measure));
            });
            if (!section.isRepeated) {
                toRender.pop();
                toRender.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/doubleBarLine.svg`}/>);
            }

            let endingMarkerNumber: number = 1;
            section.allEndings.forEach((ending: MeasureData[]) => {
                let isFirstMeasure: boolean = true;
                ending.forEach((measure: MeasureData) => {
                    let markerVal: number = null;
                    if (isFirstMeasure) markerVal = endingMarkerNumber;
                    toRender = toRender.concat(this.createMeasure(measure, markerVal));
                    isFirstMeasure = false;
                });
                endingMarkerNumber++;
            });
        });
        return <div className="lead-sheet"> { toRender } </div>;
    }

    createMeasure(measure: MeasureData, endingMarkerNumber?: number):JSX.Element[] {
        const toReturn: JSX.Element[] = [];
        toReturn.push(<Measure measure={measure} endingMarkerNumber={endingMarkerNumber}></Measure>);
        toReturn.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/barLine.svg`}/>);
        this.numMeasuresOnLine++;
        if (this.numMeasuresOnLine >= 4) {
            toReturn.push(<br/>);
            toReturn.push( <img className="bar-line" src={`${LeadSheet.SVG_LOCATION}/barLine.svg`}/>);
            this.numMeasuresOnLine = 0;
        }
        return toReturn;
    }
}
