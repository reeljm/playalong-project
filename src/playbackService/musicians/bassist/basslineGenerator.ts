import { Measure } from '../../song/measure';
import { UprightBass } from './uprightBass';
import { TheoryService } from '../../theory/theory.service';
import { Note } from '../../theory/note';
import { BasslineRequestParams } from './basslineRequestParams';
import { BasslineResponseParams } from './basslineResponseParams';
import { Chord } from '../../../../src/playbackService/theory/chord';

export class BasslineGenerator {

    private static DEFAULT_STARTING_OCTAVE = 5;
    private static DEFAULT_STARTING_DIRECTION = "up"
    private previousNoteScheduled: Note = null;
    private previousChord: Chord = null;
    private currentOctave: number;
    private direction: string;
    private presheduledNotes: Note[] = [];
    private beatsAlreadySpentOnCurrentChord: number = 0;

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
            if (!currentMeasure.nextMeasure && currentBeat !== 0) {
                break;
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
                params.lowestNote = UprightBass.LOWEST_NOTE;
                params.highestNote = UprightBass.HIGHEST_NOTE;
                params.previousNoteScheduled = this.previousNoteScheduled;
                params.previousChord = this.previousChord;
                params.currentChord = currentChord;
                params.nextChord = nextChord;
                params.desiredDirection = this.direction;
                params.beatsAlreadySpentOnCurrentChord = this.beatsAlreadySpentOnCurrentChord;
                params.nextBeatIsStrongBeat = currentBeat === currentMeasure.numberOfBeats - 1;

                if (!this.previousNoteScheduled || !nextChord) {
                    // if we are starting or ending, schedule the root:
                    params.desiredDegreeOfChord = 1;
                    params.desiredOctave = BasslineGenerator.DEFAULT_STARTING_OCTAVE;
                }
                else {
                    if (currentBeat % currentMeasure.numberOfBeats === 0) {
                        // this is a downbeat, schedule a chord tone:
                        params.requireChordTone = true;
                    } else {
                        // we don't need a chord tone:
                        params.requireChordTone = false;
                    }
                }

                params.isLastBeatOfCurrentChord = !currentChord.equals(nextChord);
                const response: BasslineResponseParams = this.theory.getNextBasslineNote(params);
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
                duration: "4n",
                velocityOffset: 0.05,
                probability: 1,
                note: noteToSchedule.toPlayableString()
            });

        }
        return eventParamArray;
    }
    newBasslineRequestParams(): BasslineRequestParams {
        return new BasslineRequestParams();
    }

}
