import { Measure } from '../../song/measure';
import { TheoryService } from '../../theory/theory.service';
import { Note } from '../../theory/note';
import { BasslineRequestParams } from './basslineRequestParams';
import { BasslineResponseParams } from './basslineResponseParams';
import { Chord } from '../../../../src/playbackService/theory/chord';
import { BasslineRule } from './basslineRule';
import { DesiredScaleDegreeBasslineRule } from './desiredScaleDegreeBasslineRule';
import { LastBeatOfCurrentChordBasslineRule } from './lastBeatOfCurrentChordBasslineRule';
import { ClosestScaleDegreeBasslineRule } from './closestScaleDegreeBasslineRule';

export class BasslineGenerator {

    private static DEFAULT_STARTING_OCTAVE: number = 2;
    private static DEFAULT_STARTING_DIRECTION: string = "up"
    private previousNoteScheduled: Note = null;
    private previousChord: Chord = null;
    private currentOctave: number;
    private direction: string;
    private presheduledNotes: Note[] = [];
    private beatsAlreadySpentOnCurrentChord: number = 0;
    private static DIFFICULT_CHORD_TYPES: string[] = ["min7b5", "dim7", "7b9"];

    constructor(private theory: TheoryService) { }

    public gerenateBasslineEventParams(currentMeasure: Measure): any[] {
        if (!this.currentOctave) {
            this.currentOctave = BasslineGenerator.DEFAULT_STARTING_OCTAVE;
        }
        if (!this.direction) {
            this.direction = BasslineGenerator.DEFAULT_STARTING_DIRECTION;
        }

        const eventParamArray = [];

        for (let currentBeat = 0; currentBeat < currentMeasure.numberOfBeats; currentBeat++) {
            let noteDuration: string = "4n";
            if (!currentMeasure.nextMeasure) {
                // the tune is over:
                if (currentBeat === 0) {
                    noteDuration = "4m";
                } else {
                    break;
                }
            }
            if (currentBeat === 1) {
                // randomly choose to change direction:
                const dirSwitch = Math.random() >= 0.9;
                if (dirSwitch) {
                    this.direction = this.direction === "up" ? "down" : "up";
                }
            }
            let noteToSchedule: Note = null;
            const currentChord: Chord = currentMeasure.chords[currentBeat];
            let nextChord: Chord = null;
            if (currentBeat === currentMeasure.numberOfBeats - 1) {
                nextChord = currentMeasure.nextMeasure ? currentMeasure.nextMeasure.chords[0] : null;
            } else {
                nextChord = currentMeasure.chords[currentBeat + 1];
            }

            if (this.presheduledNotes.length > 0) {
                noteToSchedule = this.presheduledNotes[0];
                this.presheduledNotes.shift();
            } else {
                const params: BasslineRequestParams = this.newBasslineRequestParams();
                params.previousNoteScheduled = this.previousNoteScheduled;
                params.previousChord = this.previousChord;
                params.currentChord = currentChord;
                params.nextChord = nextChord;
                params.desiredDirection = this.direction;
                params.beatsAlreadySpentOnCurrentChord = this.beatsAlreadySpentOnCurrentChord;
                params.nextBeatIsStrongBeat = currentBeat === currentMeasure.numberOfBeats - 1;
                params.isLastBeatOfCurrentChord = !currentChord.equals(nextChord);
                params.requireRoot = false;

                const isDifficultChord = BasslineGenerator.DIFFICULT_CHORD_TYPES.includes(currentChord.type);

                // see if this is a special case:
                if (!this.previousNoteScheduled || !nextChord) {
                    // if we are starting or ending, schedule the root:
                    params.desiredScaleDegree = 0;
                    params.desiredOctave = BasslineGenerator.DEFAULT_STARTING_OCTAVE;
                } else if (currentBeat % currentMeasure.numberOfBeats === 0) {
                    // this is a downbeat, schedule the root:
                    params.requireRoot = true;
                } else if (isDifficultChord) {
                    const scaleDegrees: number[] = [0, 2, 4];
                    const randomDegree = scaleDegrees[Math.floor(Math.random() * scaleDegrees.length)];
                    params.desiredScaleDegree = randomDegree;
                    params.desiredOctave = this.currentOctave;
                }

                // request the next note:
                const response: BasslineResponseParams = this.getNextBasslineNote(params);

                noteToSchedule = response.notesScheduled[0];
                response.notesScheduled.shift();
                this.presheduledNotes = response.notesScheduled;

                // Save info about this schedule cycle:
                this.previousNoteScheduled = noteToSchedule;
                if (this.previousChord && this.previousChord.equals(currentChord)) {
                    this.beatsAlreadySpentOnCurrentChord++;
                } else {
                    this.beatsAlreadySpentOnCurrentChord = 0;
                }
                this.previousChord = currentChord;
                if (this.direction === "up" && response.directionChange) {
                    this.direction = "down"
                } else if (this.direction === "down" && response.directionChange) {
                    this.direction = "up"
                }
            }

            console.log(noteToSchedule.toPlayableString());

            eventParamArray.push({
                startTime: `${currentMeasure.measureNumber}:${currentBeat}:0`,
                velocity: 0.8,
                duration: noteDuration,
                velocityOffset: 0,
                probability: 1,
                note: noteToSchedule.toPlayableString()
            });
        }
        return eventParamArray;
    }

    public getNextBasslineNote(params: BasslineRequestParams): BasslineResponseParams {
        console.log(params);

        const desiredScaleDegreeRule: BasslineRule = new DesiredScaleDegreeBasslineRule(this.theory);
        const lastBeatOfCurrentChordRule: BasslineRule = new LastBeatOfCurrentChordBasslineRule(this.theory);
        const closestScaleDegreeChordRule: BasslineRule = new ClosestScaleDegreeBasslineRule(this.theory);

        const rules: BasslineRule[] = [desiredScaleDegreeRule, lastBeatOfCurrentChordRule, closestScaleDegreeChordRule];

        for (const rule of rules) {
            const res: BasslineResponseParams = rule.getMatch(params);
            if (res) {
                return res;
            }
        }
    }

    newBasslineRequestParams(): BasslineRequestParams {
        return new BasslineRequestParams();
    }

}
