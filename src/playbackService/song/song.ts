import { Theory } from '../theory/theory';
import { Measure } from './measure';

export class Song {

    private measures: Measure[] = [];
    private currentMeasure: number = -1;
    private currentIteration: number = 0;
    private totalIterations: number = 10;
    private style: string = "swing";

    constructor(private theory: Theory) {
        // lady bird
        // this.addMeasure(new Measure(1, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4));
        // this.addMeasure(new Measure(2, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4));
        // this.addMeasure(new Measure(3, this.style, [this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7')], 4));
        // this.addMeasure(new Measure(4, this.style, [this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7')], 4));
        // this.addMeasure(new Measure(5, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4));
        // this.addMeasure(new Measure(6, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4));
        // this.addMeasure(new Measure(7, this.style, [this.theory.getChord('Bb', 'min7'), this.theory.getChord('Bb', 'min7'), this.theory.getChord('Bb', 'min7'), this.theory.getChord('Bb', 'min7')], 4));
        // this.addMeasure(new Measure(8, this.style, [this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7')], 4));
        // this.addMeasure(new Measure(9, this.style, [this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7')], 4));
        // this.addMeasure(new Measure(10, this.style, [this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7')], 4));
        // this.addMeasure(new Measure(11, this.style, [this.theory.getChord('G', 'maj7'), this.theory.getChord('G', 'maj7'), this.theory.getChord('G', 'maj7'), this.theory.getChord('G', 'maj7')], 4));
        // this.addMeasure(new Measure(12, this.style, [this.theory.getChord('G', 'maj7'), this.theory.getChord('G', 'maj7'), this.theory.getChord('G', 'maj7'), this.theory.getChord('G', 'maj7')], 4));
        // this.addMeasure(new Measure(13, this.style, [this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7')], 4));
        // this.addMeasure(new Measure(14, this.style, [this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));
        // this.addMeasure(new Measure(15, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7')], 4));
        // this.addMeasure(new Measure(16, this.style, [this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Db', 'maj7'), this.theory.getChord('Db', 'maj7')], 4));


        // another you
        // this.addMeasure(new Measure(1, this.style, [this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7')], 4));
        // this.addMeasure(new Measure(2, this.style, [this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7')], 4));
        // this.addMeasure(new Measure(3, this.style, [this.theory.getChord('D', 'min7b5'), this.theory.getChord('D', 'min7b5'), this.theory.getChord('D', 'min7b5'), this.theory.getChord('D', 'min7b5')], 4));
        // this.addMeasure(new Measure(4, this.style, [this.theory.getChord('G', '7b9'), this.theory.getChord('G', '7b9'), this.theory.getChord('G', '7b9'), this.theory.getChord('G', '7b9')], 4));
        // this.addMeasure(new Measure(5, this.style, [this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7')], 4));
        // this.addMeasure(new Measure(6, this.style, [this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7')], 4));
        // this.addMeasure(new Measure(7, this.style, [this.theory.getChord('Bb', 'min7'), this.theory.getChord('Bb', 'min7'), this.theory.getChord('Bb', 'min7'), this.theory.getChord('Bb', 'min7')], 4));
        // this.addMeasure(new Measure(8, this.style, [this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7')], 4));
        // this.addMeasure(new Measure(9, this.style, [this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7')], 4));
        // this.addMeasure(new Measure(10, this.style, [this.theory.getChord('Ab', 'min7'), this.theory.getChord('Ab', 'min7'), this.theory.getChord('Ab', 'min7'), this.theory.getChord('Ab', 'min7')], 4));
        // this.addMeasure(new Measure(11, this.style, [this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7')], 4));
        // this.addMeasure(new Measure(12, this.style, [this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7')], 4));
        // this.addMeasure(new Measure(13, this.style, [this.theory.getChord('F', '7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7')], 4));
        // this.addMeasure(new Measure(14, this.style, [this.theory.getChord('F', '7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7')], 4));
        // this.addMeasure(new Measure(15, this.style, [this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7')], 4));
        // this.addMeasure(new Measure(16, this.style, [this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7')], 4));


        // satin doll:
        // this.addMeasure(new Measure(1, this.style, [this.theory.getChord('D','min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));
        // this.addMeasure(new Measure(2, this.style, [this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));
        // this.addMeasure(new Measure(3, this.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));
        // this.addMeasure(new Measure(4, this.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));
        // this.addMeasure(new Measure(5, this.style, [this.theory.getChord('A', 'min7'), this.theory.getChord('A', 'min7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4));
        // this.addMeasure(new Measure(6, this.style, [this.theory.getChord('Ab', 'min7'), this.theory.getChord('Ab', 'min7'), this.theory.getChord('Db', '7'), this.theory.getChord('Db', '7')], 4));
        // this.addMeasure(new Measure(7, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7')], 4));
        // this.addMeasure(new Measure(8, this.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));

        // this.addMeasure(new Measure(9, this.style, [this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));
        // this.addMeasure(new Measure(10, this.style, [this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));
        // this.addMeasure(new Measure(11, this.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));
        // this.addMeasure(new Measure(12, this.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));
        // this.addMeasure(new Measure(13, this.style, [this.theory.getChord('A', 'min7'), this.theory.getChord('A', 'min7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4));
        // this.addMeasure(new Measure(14, this.style, [this.theory.getChord('Ab', 'min7'), this.theory.getChord('Ab', 'min7'), this.theory.getChord('Db', '7'), this.theory.getChord('Db', '7')], 4));
        // this.addMeasure(new Measure(15, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4));
        // this.addMeasure(new Measure(16, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4));

        // this.addMeasure(new Measure(17, this.style, [this.theory.getChord('G', 'min7'), this.theory.getChord('G', 'min7'), this.theory.getChord('C', '7'), this.theory.getChord('C', '7')], 4));
        // this.addMeasure(new Measure(18, this.style, [this.theory.getChord('G', 'min7'), this.theory.getChord('G', 'min7'), this.theory.getChord('C', '7'), this.theory.getChord('C', '7')], 4));
        // this.addMeasure(new Measure(19, this.style, [this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7')], 4));
        // this.addMeasure(new Measure(20, this.style, [this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7')], 4));
        // this.addMeasure(new Measure(21, this.style, [this.theory.getChord('A', 'min7'), this.theory.getChord('A', 'min7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4));
        // this.addMeasure(new Measure(22, this.style, [this.theory.getChord('A', 'min7'), this.theory.getChord('A', 'min7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4));
        // this.addMeasure(new Measure(23, this.style, [this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));
        // this.addMeasure(new Measure(24, this.style, [this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));

        // this.addMeasure(new Measure(25, this.style, [this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));
        // this.addMeasure(new Measure(26, this.style, [this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4));
        // this.addMeasure(new Measure(27, this.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));
        // this.addMeasure(new Measure(28, this.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));
        // this.addMeasure(new Measure(29, this.style, [this.theory.getChord('A', 'min7'), this.theory.getChord('A', 'min7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4));
        // this.addMeasure(new Measure(30, this.style, [this.theory.getChord('Ab', 'min7'), this.theory.getChord('Ab', 'min7'), this.theory.getChord('Db', '7'), this.theory.getChord('Db', '7')], 4));
        // this.addMeasure(new Measure(31, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4));
        // this.addMeasure(new Measure(32, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4));


        // Bb Blues
        this.addMeasure(new Measure(1, this.style, [this.theory.getChord('Bb','7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7')], 4));
        this.addMeasure(new Measure(2, this.style, [this.theory.getChord('Bb','7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7')], 4));
        this.addMeasure(new Measure(3, this.style, [this.theory.getChord('Bb','7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7')], 4));
        this.addMeasure(new Measure(4, this.style, [this.theory.getChord('F','min7'), this.theory.getChord('F', 'min7'), this.theory.getChord('C', '7'), this.theory.getChord('C', '7')], 4));
        this.addMeasure(new Measure(5, this.style, [this.theory.getChord('Eb','7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7')], 4));
        this.addMeasure(new Measure(6, this.style, [this.theory.getChord('E','7b9'), this.theory.getChord('E', '7b9'), this.theory.getChord('E', '7b9'), this.theory.getChord('E', '7b9')], 4));
        this.addMeasure(new Measure(7, this.style, [this.theory.getChord('D','7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4));
        this.addMeasure(new Measure(8, this.style, [this.theory.getChord('A','7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4));
        this.addMeasure(new Measure(9, this.style, [this.theory.getChord('C','min7'), this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7')], 4));
        this.addMeasure(new Measure(10, this.style, [this.theory.getChord('F','7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7')], 4));
        this.addMeasure(new Measure(11, this.style, [this.theory.getChord('Bb','7'), this.theory.getChord('Bb','7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7'),], 4));
        this.addMeasure(new Measure(12, this.style, [this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7')], 4));
    }

    private addMeasure(measureToAdd: Measure): void {
        if (this.measures.length > 0) {
            this.measures[this.measures.length - 1].nextMeasure = measureToAdd;
        }
        measureToAdd.nextMeasure = this.measures[0];
        this.measures.push(measureToAdd);
    }

    public nextMeasure(): Measure {
        this.currentMeasure++;
        if (this.currentMeasure >= this.measures.length) {
            this.currentMeasure = 0;
            this.currentIteration++;
        }

        if (this.currentIteration >= this.totalIterations) {
            if (this.currentMeasure === 0) {
                this.measures[0].nextMeasure = null;
            } else {
                return null;
            }
        }
        const originalMeasureNumber: number = this.measures[this.currentMeasure].originalMeasureNumber;
        const totalNumMeasures: number = this.measures.length;
        this.measures[this.currentMeasure].arrangementMeasureNumber = originalMeasureNumber + totalNumMeasures * this.currentIteration;
        return this.measures[this.currentMeasure];
    }

    public restart(): void {
        this.currentMeasure = -1;
        this.currentIteration = 0;
    }

}
