import { Measure } from './measure';

export class Section {

    constructor(
        private name: string,
        private measures: Measure[],
        private repeat: boolean = false,
        private numRepeats?: number,
        private endings?: Measure[][]
    ) { }

    public get length(): number {
        return this.measures.length;
    }

    public get isRepeated(): boolean {
        return this.repeat;
    }

    public getMeasure(measureNumber: number, repeatNumber?: number): Measure {
        // if we've finished our repeats, return null
        if (this.repeat && repeatNumber >= this.numRepeats) {
            return null;
        }

        // figure out which measure we are in:
        let allMeasuresInSection: Measure[] = [];
        let currentEnding: Measure[] = [];
        if (this.repeat && this.endings) {
            currentEnding = this.endings[repeatNumber];
        }
        allMeasuresInSection = allMeasuresInSection.concat(this.measures);
        allMeasuresInSection = allMeasuresInSection.concat(currentEnding);
        const self = this;
        let measure: Measure = allMeasuresInSection.find((m: Measure) => {
            return m.originalMeasureNumber === measureNumber || m.originalMeasureNumber > measureNumber;
        });

        if (!measure) {
            if (repeatNumber === this.numRepeats - 1) {
                return null;
            } else {
                measure = allMeasuresInSection[0];
            }
        }

        const indexOfMeasure: number = allMeasuresInSection.indexOf(measure);
        if (indexOfMeasure === allMeasuresInSection.length - 1) {
            if (!this.repeat) {
                measure.nextMeasure = null;
            } else if (repeatNumber >= this.numRepeats - 1) {
                measure.nextMeasure = null;
            } else if (repeatNumber < this.numRepeats - 1) {
                measure.nextMeasure = allMeasuresInSection[0];
            }
        } else {
            measure.nextMeasure = allMeasuresInSection[indexOfMeasure + 1];
        }
        return measure;
    }

    public get allMeasures(): Measure[] {
        return this.measures;
    }

    public get allEndings(): Measure[][] {
        return this.endings;
    }

    public get repeats(): boolean {
        return this.repeat;
    }
}
