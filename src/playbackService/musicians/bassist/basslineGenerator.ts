import { Measure } from '../../song/measure';
import { UprightBass } from './uprightBass';
import { TheoryService } from '../../theory/theory.service';
import { Note } from '../../theory/note';
import { BasslineRequestParams } from './basslineRequestParams';
import { BasslineResponseParams } from './basslineResponseParams';

export class BasslineGenerator {

    private static DEFAULT_STARTING_OCTAVE = 6;
    private static DEFAULT_STARTING_DIRECTION = "down"
    private lastNoteScheduled: Note = null;
    private currentOctave: number;
    private direction: string;

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
            const params: BasslineRequestParams = this.newBasslineRequestParams();
            params.lowestNote = UprightBass.LOWEST_NOTE;
            params.highestNote = UprightBass.HIGHEST_NOTE;
            params.chord = currentMeasure.chords[0];
            params.nextChord = currentMeasure.nextMeasure ? currentMeasure.nextMeasure.chords[0] : null;
            params.desiredDirection = this.direction;
            params.lastNoteScheduled = this.lastNoteScheduled;

            if (!this.lastNoteScheduled) {
                // since we are just staring out, schedule the root:
                params.desiredDegreeOfChord = 1;
                params.desiredOctave = BasslineGenerator.DEFAULT_STARTING_OCTAVE;
            }
            else {
                if (i % currentMeasure.numberOfBeats === 0) {
                    // this is a downbeat, schedule a chord tone:
                    params.requireChordTone = true;
                } else {
                    // we dont need a chord tone:
                    params.requireChordTone = false;
                }
            }

            params.numberOfBeatsUntilNextChord = currentMeasure.numberOfBeats - i;

            const response: BasslineResponseParams = this.theory.getNextBasslineNote(params);

            eventParamArray.push({
                startTime: `${currentMeasure.measureNumber}:${i}:0`,
                velocity: 0.8,
                duration: "4n",
                velocityOffset: 0.05,
                probability: 1,
                note: response.noteScheduled.toPlayableString()
            });

            // Save info about this schedule cycle:
            this.lastNoteScheduled = response.noteScheduled;
            if (this.direction === "up" && response.directionChange) {
                this.direction = "down"
            } else if (this.direction === "down" && response.directionChange) {
                this.direction = "up"
            }
        }
        return eventParamArray;
    }
    newBasslineRequestParams(): BasslineRequestParams {
        return new BasslineRequestParams();
    }

}
