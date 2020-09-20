import { Measure } from '../../song/measure';
import { UprightBass } from './uprightBass';
import { TheoryService } from '../../theory/theory.service';
import { Note } from '../../theory/note';
import { BasslineRequestParams } from './basslineRequestParams';
import { BasslineResponseParams } from './basslineResponseParams';
import { Chord } from '../../../../src/playbackService/theory/chord';

export class BasslineGenerator {

    private static DEFAULT_STARTING_OCTAVE = 6;
    private static DEFAULT_STARTING_DIRECTION = "down"
    private previousNoteScheduled: Note = null;
    private previousChord: Chord = null;
    private currentOctave: number;
    private direction: string;
    private presheduledNotes: Note[] = [];

    constructor(private theory: TheoryService) { }

    public gerenateBasslineEventParams(currentMeasure: Measure): any[] {
        if (!this.currentOctave) {
            this.currentOctave = BasslineGenerator.DEFAULT_STARTING_OCTAVE;
        }
        if (!this.direction) {
            this.direction = BasslineGenerator.DEFAULT_STARTING_DIRECTION;
        }

        const eventParamArray = [];

        for (let i = 0; i < currentMeasure.numberOfBeats; i++) {
            let noteToSchedule: Note = null;

            const currentChord = currentMeasure.chords[0];

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
                params.nextChord = currentMeasure.nextMeasure ? currentMeasure.nextMeasure.chords[0] : null;
                params.desiredDirection = this.direction;

                if (!this.previousNoteScheduled) {
                    // since we are just staring out, schedule the root:
                    params.desiredDegreeOfChord = 1;
                    params.desiredOctave = BasslineGenerator.DEFAULT_STARTING_OCTAVE;
                }
                else {
                    if (i % currentMeasure.numberOfBeats === 0) {
                        // this is a downbeat, schedule a chord tone:
                        params.requireChordTone = true;
                    } else {
                        // we don't need a chord tone:
                        params.requireChordTone = false;
                    }
                }
                params.numberOfBeatsUntilNextChord = currentMeasure.numberOfBeats - i;
                const response: BasslineResponseParams = this.theory.getNextBasslineNote(params);
                noteToSchedule = response.notesScheduled[0];
                response.notesScheduled.shift();
                this.presheduledNotes = response.notesScheduled;

                // Save info about this schedule cycle:
                this.previousNoteScheduled = noteToSchedule;
                this.previousChord = currentChord;
                if (this.direction === "up" && response.directionChange) {
                    this.direction = "down"
                } else if (this.direction === "down" && response.directionChange) {
                    this.direction = "up"
                }
            }

            
            if (i === 0) {
            console.log("---------------------");
                if (currentMeasure.measureNumber % 16 === 1) {
                    console.log("===========top=============");
                }
            }
            console.log(noteToSchedule.toPlayableString());


            eventParamArray.push({
                startTime: `${currentMeasure.measureNumber}:${i}:0`,
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
