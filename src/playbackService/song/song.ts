import { Chord } from '../theory/chord';
import { Theory } from '../theory/theory';
import { Measure } from './measure';
import { Section } from './section';

export class Song {
    private name: string;
    private sectionIndex: number = 0;
    private currentSection: Section;
    private repeatNumber: number = 0;
    private currentIteration: number = 0;
    private totalIterations: number = 3;
    private sections: Section[] = [];
    private previousMeasure: Measure;
    private measureNumber: number = 0;
    private arrangementMeasureNumber: number = 0;

    constructor(private theory: Theory) { }

    public deserialize(data: any): Song {
        this.name = data.name;
        this.sections = [];
        const t = this.theory;

        data.sections.forEach((s: any) => {
            const measures: Measure[] = [];
            s.measures.forEach((m: any) => {
                const chords: Chord[] = [];
                m.chords.forEach((c: any) => {
                    chords.push(t.getChord(c[0], c[1]));
                });
                const measure: Measure =
                new Measure(
                    m.originalMeasureNumber,
                    m.style,
                    chords,
                    m.numberOfBeats
                    );
                measures.push(measure);
            });

            const endings: Measure[][] = [];
            s.endings = s.endings || [];
            s.endings.forEach((e: any) => {
                const ending: Measure[] = [];
                e.forEach((m: any) => {
                    const chords: Chord[] = [];
                    m.chords.forEach((c: any) => {
                        chords.push(t.getChord(c[0], c[1]));
                    });
                    const measure: Measure =
                    new Measure(
                        m.originalMeasureNumber,
                        m.style,
                        chords,
                        m.numberOfBeats
                        );
                    ending.push(measure);
                });
                endings.push(ending);
            });
            const section: Section = new Section(s.name, measures, s.repeat, s.numRepeats, endings);
            this.sections.push(section);
        });
        return this;
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

    public setTotalIterations(iterations: number) {
        this.totalIterations = iterations;
    }

    public getTotalIterations() {
        return this.totalIterations;
    }

}
