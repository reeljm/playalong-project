import { Chord } from '../theory/chord';

export class Measure {

    measureNumber: number;
    style: string;
    chords: Chord[];
    numberOfBeats: number;
    nextMeasure?: Measure;

    constructor(measureNumber: number, style: string, chords: Chord[], numberOfBeats: number) {
        this.measureNumber = measureNumber;
        this.style = style;
        this.chords = chords;
        this.numberOfBeats = numberOfBeats;
    }
}
