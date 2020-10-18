import { Theory } from '../theory/theory';
import { Measure } from './measure';
import { Section } from './section';

export class Song {
    private name: string;
    private sectionIndex: number = 0;
    private currentSection: Section;
    private repeatNumber: number = 0;
    private currentIteration: number = 0;
    private totalIterations: number = 1;
    private style: string = "swing";
    private sections: Section[] = [];
    private previousMeasure: Measure;
    private measureNumber: number = 0;
    private arrangementMeasureNumber: number = 0;

    constructor(private theory: Theory) {
        // lady bird
        const headMeasures: Measure[] = [
            new Measure(1, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4),
            new Measure(2, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4),
            new Measure(3, this.style, [this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7')], 4),
            new Measure(4, this.style, [this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7')], 4),
            new Measure(5, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4),
            new Measure(6, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4),
            new Measure(7, this.style, [this.theory.getChord('Bb', 'min7'), this.theory.getChord('Bb', 'min7'), this.theory.getChord('Bb', 'min7'), this.theory.getChord('Bb', 'min7')], 4),
            new Measure(8, this.style, [this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7')], 4),
            new Measure(9, this.style, [this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7')], 4),
            new Measure(10, this.style, [this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7')], 4),
            new Measure(11, this.style, [this.theory.getChord('G', 'maj7'), this.theory.getChord('G', 'maj7'), this.theory.getChord('G', 'maj7'), this.theory.getChord('G', 'maj7')], 4),
            new Measure(12, this.style, [this.theory.getChord('G', 'maj7'), this.theory.getChord('G', 'maj7'), this.theory.getChord('G', 'maj7'), this.theory.getChord('G', 'maj7')], 4),
            new Measure(13, this.style, [this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7')], 4),
            new Measure(14, this.style, [this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4),
            new Measure(15, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7')], 4),
            new Measure(16, this.style, [this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Db', 'maj7'), this.theory.getChord('Db', 'maj7')], 4),
        ];
        const head: Section = new Section("Head", headMeasures, false);
        this.sections.push(head);
        this.name = "Lady Bird"






        // another you
        // const measuresA: Measure[] = [
        //     new Measure(1, this.style, [this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7')], 4),
        //     new Measure(2, this.style, [this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7')], 4),
        //     new Measure(3, this.style, [this.theory.getChord('D', 'min7b5'), this.theory.getChord('D', 'min7b5'), this.theory.getChord('D', 'min7b5'), this.theory.getChord('D', 'min7b5')], 4),
        //     new Measure(4, this.style, [this.theory.getChord('G', '7b9'), this.theory.getChord('G', '7b9'), this.theory.getChord('G', '7b9'), this.theory.getChord('G', '7b9')], 4),
        //     new Measure(5, this.style, [this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7')], 4),
        //     new Measure(6, this.style, [this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7'), this.theory.getChord('C', 'relative min7')], 4),
        //     new Measure(7, this.style, [this.theory.getChord('Bb', 'min7'), this.theory.getChord('Bb', 'min7'), this.theory.getChord('Bb', 'min7'), this.theory.getChord('Bb', 'min7')], 4),
        //     new Measure(8, this.style, [this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7')], 4),
        //     new Measure(9, this.style, [this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7'), this.theory.getChord('Ab', 'maj7')], 4),
        //     new Measure(10, this.style, [this.theory.getChord('Db', '7'), this.theory.getChord('Db', '7'), this.theory.getChord('Db', '7'), this.theory.getChord('Db', '7')], 4),
        //     new Measure(11, this.style, [this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7')], 4),
        //     new Measure(12, this.style, [this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7')], 4),
        // ];

        // const e1: Measure[] = [
        //     new Measure(13, this.style, [this.theory.getChord('F', '7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7')], 4),
        //     new Measure(14, this.style, [this.theory.getChord('F', '7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7')], 4),
        //     new Measure(15, this.style, [this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7')], 4),
        //     new Measure(16, this.style, [this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7')], 4),
        // ];

        // const e2: Measure[] = [
        //     new Measure(17, this.style, [this.theory.getChord('G', 'min7'), this.theory.getChord('G', 'min7'), this.theory.getChord('Ab', '7'), this.theory.getChord('Ab', '7')], 4),
        //     new Measure(18, this.style, [this.theory.getChord('G', 'min7'), this.theory.getChord('G', 'min7'), this.theory.getChord('C', '7'), this.theory.getChord('C', '7')], 4),
        //     new Measure(19, this.style, [this.theory.getChord('F', 'min7'), this.theory.getChord('F', 'min7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7')], 4),
        //     new Measure(20, this.style, [this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7'), this.theory.getChord('Eb', 'maj7')], 4),
        // ];

        // const head: Section = new Section("Head", measuresA, true, 2, [e1, e2]);
        // this.sections.push(head);
        // this.name = "There Will Never Be Another You"






        // satin doll:
        // const measuresA: Measure[] = [
        //     new Measure(1, this.style, [this.theory.getChord('D','min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4),
        //     new Measure(2, this.style, [this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4),
        //     new Measure(3, this.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4),
        //     new Measure(4, this.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4),
        //     new Measure(5, this.style, [this.theory.getChord('A', 'min7'), this.theory.getChord('A', 'min7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4),
        //     new Measure(6, this.style, [this.theory.getChord('Ab', 'min7'), this.theory.getChord('Ab', 'min7'), this.theory.getChord('Db', '7'), this.theory.getChord('Db', '7')], 4)
        // ];

        // const e1: Measure[] = [
        //     new Measure(7, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7')], 4),
        //     new Measure(8, this.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4)
        // ];

        // const e2: Measure[] = [
        //     new Measure(9, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4),
        //     new Measure(10, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4),
        // ];
        // const a: Section = new Section("A", measuresA, true, 2, [e1, e2]);


        // const measuresB: Measure[] = [
        //     new Measure(11, this.style, [this.theory.getChord('G', 'min7'), this.theory.getChord('G', 'min7'), this.theory.getChord('C', '7'), this.theory.getChord('C', '7')], 4),
        //     new Measure(12, this.style, [this.theory.getChord('G', 'min7'), this.theory.getChord('G', 'min7'), this.theory.getChord('C', '7'), this.theory.getChord('C', '7')], 4),
        //     new Measure(13, this.style, [this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7')], 4),
        //     new Measure(14, this.style, [this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7'), this.theory.getChord('F', 'maj7')], 4),
        //     new Measure(15, this.style, [this.theory.getChord('A', 'min7'), this.theory.getChord('A', 'min7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4),
        //     new Measure(16, this.style, [this.theory.getChord('A', 'min7'), this.theory.getChord('A', 'min7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4),
        //     new Measure(17, this.style, [this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4),
        //     new Measure(18, this.style, [this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4)
        // ];
        // const b: Section = new Section("B", measuresB, false);


        // const measuresC: Measure[] = [
        //     new Measure(19, this.style, [this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4),
        //     new Measure(20, this.style, [this.theory.getChord('D', 'min7'), this.theory.getChord('D', 'min7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7')], 4),
        //     new Measure(21, this.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4),
        //     new Measure(22, this.style, [this.theory.getChord('E', 'min7'), this.theory.getChord('E', 'min7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4),
        //     new Measure(23, this.style, [this.theory.getChord('A', 'min7'), this.theory.getChord('A', 'min7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4),
        //     new Measure(24, this.style, [this.theory.getChord('Ab', 'min7'), this.theory.getChord('Ab', 'min7'), this.theory.getChord('Db', '7'), this.theory.getChord('Db', '7')], 4),
        //     new Measure(25, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4),
        //     new Measure(26, this.style, [this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7'), this.theory.getChord('C', 'maj7')], 4)
        // ];
        // const lastA: Section = new Section("A", measuresC, false);
        // this.sections.push(a, b, lastA);
        // this.name = "Satin Doll"





        // Bb Blues
        // const headMeasures: Measure[] = [
        //     new Measure(1, this.style, [this.theory.getChord('Bb','7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7')], 4),
        //     new Measure(2, this.style, [this.theory.getChord('Bb','7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7')], 4),
        //     new Measure(3, this.style, [this.theory.getChord('Bb','7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7'), this.theory.getChord('Bb', '7')], 4),
        //     new Measure(4, this.style, [this.theory.getChord('F','min7'), this.theory.getChord('F', 'min7'), this.theory.getChord('C', '7'), this.theory.getChord('C', '7')], 4),
        //     new Measure(5, this.style, [this.theory.getChord('Eb','7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7'), this.theory.getChord('Eb', '7')], 4),
        //     new Measure(6, this.style, [this.theory.getChord('E','7b9'), this.theory.getChord('E', '7b9'), this.theory.getChord('E', '7b9'), this.theory.getChord('E', '7b9')], 4),
        //     new Measure(7, this.style, [this.theory.getChord('D','7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7'), this.theory.getChord('D', '7')], 4),
        //     new Measure(8, this.style, [this.theory.getChord('A','7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7'), this.theory.getChord('A', '7')], 4),
        //     new Measure(9, this.style, [this.theory.getChord('C','min7'), this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7')], 4),
        //     new Measure(10, this.style, [this.theory.getChord('F','7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7')], 4),
        //     new Measure(11, this.style, [this.theory.getChord('Bb','7'), this.theory.getChord('Bb','7'), this.theory.getChord('G', '7'), this.theory.getChord('G', '7'),], 4),
        //     new Measure(12, this.style, [this.theory.getChord('C', 'min7'), this.theory.getChord('C', 'min7'), this.theory.getChord('F', '7'), this.theory.getChord('F', '7')], 4),
        // ];
        // const head: Section = new Section("head", headMeasures, false);
        // this.sections.push(head);
        // this.name = "Blues"
    }

    public nextMeasure(): Measure {
        this.measureNumber++;
        this.arrangementMeasureNumber++;
        if (!this.currentSection) {
            this.currentSection = this.sections[0];
            if (this.currentSection.isRepeated) {
                this.repeatNumber = 0;
            }
        }

        const measure: Measure = this.currentSection.getMeasure(this.measureNumber, this.repeatNumber);
        this.measureNumber = measure.originalMeasureNumber;

        // if we have done all repeats, end the song:
        if (this.currentIteration >= this.totalIterations) {
            if (this.measureNumber === 1) {
                measure.nextMeasure = null;
            } else {
                return null;
            }
        }
        // if next measure is blank, set up next section:
        else if (!measure.nextMeasure) {
            this.repeatNumber = 0;
            this.sectionIndex = (this.sectionIndex + 1) % this.sections.length;
            if (this.sectionIndex === 0) {
                this.measureNumber = 0;
                this.currentIteration++;
                this.repeatNumber = -1;
            }
            this.currentSection = this.sections[this.sectionIndex];

            // get next measure for the measure we are currently on:
            const nextMeasure: Measure = this.currentSection.getMeasure(this.measureNumber + 1, this.repeatNumber);
            measure.nextMeasure = nextMeasure;
        }
        // if next measure is lower in number than current measure, we just started another repeat:
        else if (this.previousMeasure && this.measureNumber < this.previousMeasure.originalMeasureNumber) {
            this.repeatNumber++;
        }

        measure.arrangementMeasureNumber = this.arrangementMeasureNumber;
        this.previousMeasure = measure;
        return measure;
    }

    public get allSections(): Section[] {
        return this.sections;
    }

    public restart(): void {
        this.arrangementMeasureNumber = -1;
        this.currentIteration = 0;

        this.sectionIndex = 0;
        this.currentSection = this.sections[0];
        this.repeatNumber = 0;
        this.previousMeasure = null;
        this.arrangementMeasureNumber = 0;
        this.measureNumber = 0;
    }

    public get songName(): string {
        return this.name
    }

}
