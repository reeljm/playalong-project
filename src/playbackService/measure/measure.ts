import { Chord } from '../theory/chord';

export class Measure {

    measureNumber: number;
    style: string;
    chords: Chord[];

    constructor(measureNumber: number, style: string, chords: Chord[]) {
        this.measureNumber = measureNumber;
        this.style = style;
        this.chords = chords;
    }
}
