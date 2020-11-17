import { Chord } from '../theory/chord';
import { Note } from '../theory/note';
import { Theory } from '../theory/theory';
import { Measure } from './measure';
import { Section } from './section';

export class Song {

    private name: string;
    private tempo: number;
    private sectionIndex: number = 0;
    private currentSection: Section;
    private repeatNumber: number = 0;
    private currentIteration: number = 0;
    private totalIterations: number = 3;
    private sections: Section[] = [];
    private previousMeasure: Measure;
    private measureNumber: number = 0;
    private arrangementMeasureNumber: number = 0;
    private isOnFirstMeasureOfTune: boolean = false;
    private isLastMeasureOfTune: boolean = false;
    public runNewChorusCallback: boolean = true;
    private displayedChordsKey: string = "C";

    constructor(private theory: Theory) { }

    public deserialize(data: any): Song {
        this.name = data.name;
        this.tempo = data.tempo;
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
        if (this.isLastMeasureOfTune) {
            this.isOnFirstMeasureOfTune = true;
            this.isLastMeasureOfTune = false;
            this.runNewChorusCallback = false;
        } else if (this.isOnFirstMeasureOfTune) {
            this.isOnFirstMeasureOfTune = false;
            this.isLastMeasureOfTune = false;
            this.runNewChorusCallback = true;
        } else if (this.runNewChorusCallback) {
            this.isOnFirstMeasureOfTune = false;
            this.isLastMeasureOfTune = false;
            this.runNewChorusCallback = false;
        }
        else {
            this.isOnFirstMeasureOfTune = false;
            this.isLastMeasureOfTune = false;
            this.runNewChorusCallback = false;
        }
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
                this.isLastMeasureOfTune = true;
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
        this.currentSection = null;
        this.repeatNumber = 0;
        this.previousMeasure = null;
        this.arrangementMeasureNumber = 0;
        this.measureNumber = 0;
    }

    public get songName(): string {
        return this.name;
    }

    public get songTempo(): number {
        return this.tempo;
    }

    public setTotalIterations(iterations: number) {
        this.totalIterations = iterations;
    }

    public getTotalIterations() {
        return this.totalIterations;
    }

    public getCurrentIteration() {
        return this.currentIteration;
    }

    public transposeDisplayedChords(newKey: string) {
        // add a step here that converts sharps to the flat enharmonic equivalent
        const displayedChordsKeyAsNote: Note = this.theory.getNote(this.displayedChordsKey, 4);
        const newDisplayedChordsKeyAsNote: Note = this.theory.getNoteInClosestOctave(newKey, displayedChordsKeyAsNote);
        const transpositionDistance: number = this.theory.distanceTo(newDisplayedChordsKeyAsNote, displayedChordsKeyAsNote);

        const sharpsToFlats: Map<string, string> = new Map<string, string>();
        sharpsToFlats.set("C#", "Db");
        sharpsToFlats.set("D#", "Eb");
        sharpsToFlats.set("F#", "Gb");
        sharpsToFlats.set("G#", "Ab");
        sharpsToFlats.set("A#", "Bb");

        this.sections.forEach((s: Section) => {
            s.allMeasures.forEach((m: Measure) => {
                m.chords.forEach((c: Chord) => {
                    const writtenRootAsNote: Note = this.theory.getNoteInClosestOctave(c.writtenRoot, displayedChordsKeyAsNote);
                    c.writtenRoot = this.theory.transpose(writtenRootAsNote, transpositionDistance).pitch;
                    if (sharpsToFlats.has(c.writtenRoot)) {
                        c.writtenRoot = sharpsToFlats.get(c.writtenRoot);
                    }
                });
            });

            s.allEndings.forEach((e: Measure[]) => {
                e.forEach((m: Measure) => {
                    const displayedChordsKeyAsNote: Note = this.theory.getNote(this.displayedChordsKey, 4);
                    m.chords.forEach((c: Chord) => {
                        const writtenRootAsNote: Note = this.theory.getNoteInClosestOctave(c.writtenRoot, displayedChordsKeyAsNote);
                        c.writtenRoot = this.theory.transpose(writtenRootAsNote, transpositionDistance).pitch;
                        if (sharpsToFlats.has(c.writtenRoot)) {
                            c.writtenRoot = sharpsToFlats.get(c.writtenRoot);
                        }
                    });
                });
            });
        });
        this.displayedChordsKey = newKey;
    }

    public getMeasureByUUID(UUID: string): Measure {
        let toReturn: Measure = null;
        this.sections.forEach((s: Section) => {
            s.allMeasures.forEach((m: Measure) => {
                if (m.uniqueID === UUID) {
                    toReturn = m;
                }
            });

            s.allEndings.forEach((e: Measure[]) => {
                e.forEach((m: Measure) => {
                    if (m.uniqueID === UUID) {
                        toReturn = m;
                    }
                });
            });
        });
        return toReturn
    }

    public get getFirstMeasure(): Measure {
        return this.sections[0].allMeasures[0];
    }
}
