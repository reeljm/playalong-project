import { Measure } from './measure';

export class Song {

    measures: Measure[] = [];

    addMeasure(measureToAdd: Measure): void {
        if (this.measures.length > 0) {
            this.measures[this.measures.length - 1].nextMeasure = measureToAdd;
        }
        this.measures.push(measureToAdd);
    }
}
