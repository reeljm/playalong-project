import { Chord } from '../theory/chord';

export class Measure {

    arrangementMeasureNumber: number;
    originalMeasureNumber: number;
    style: string;
    chords: Chord[];
    numberOfBeats: number;
    nextMeasure: Measure;
    uniqueID: string;
    originalStyle: string;

    constructor(measureNumber: number, style: string, chords: Chord[], numberOfBeats: number) {
        this.originalMeasureNumber = measureNumber;
        this.style = style;
        this.originalStyle = style;
        this.chords = chords;
        this.numberOfBeats = numberOfBeats;
    }
}
