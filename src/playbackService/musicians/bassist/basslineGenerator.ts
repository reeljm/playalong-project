import { Measure } from '../../measure/measure';
import { UprightBass } from './uprightBass';
import { TheoryService } from '../../theory/theory.service';
import { Note } from '../../theory/note';
import { BasslineRequestParams } from './basslineRequestParams';
import { BasslineResponseParams } from './basslineResponseParams';

export class BasslineGenerator {

    private static DEFAULT_STARTING_OCTAVE = 5;
    private lastNoteScheduled: Note = null;
    private currentOctave: number;
    private direction: string;

    constructor(private theory: TheoryService) { }

    public gerenateBasslineEventParams(currentMeasure: Measure): any[] {
        if (!this.currentOctave) {
            this.currentOctave = BasslineGenerator.DEFAULT_STARTING_OCTAVE;
        }
        if (!this.direction) {
            this.direction = "up";
        }

        const eventParamArray = [];

        for (let i = 0; i < currentMeasure.numberOfBeats; i++) {
            const params: BasslineRequestParams = this.newBasslineRequestParams();
            params.lowestNote = UprightBass.LOWEST_NOTE;
            params.highestNote = UprightBass.HIGHEST_NOTE;
            params.chord = currentMeasure.chords[0];
            params.desiredDirection = this.direction;
            params.lastNoteScheduled = this.lastNoteScheduled;

            if (!this.lastNoteScheduled) {
                // since we are just staring out, schedule the root:
                params.desiredDegreeOfChord = 1;
                params.desiredOctave = BasslineGenerator.DEFAULT_STARTING_OCTAVE;
            }
            else {
                if (i % 2 === 0) {
                    // This is beat 1 or 3. Schedule a chord tone:
                    params.requireChordTone = true;
                } else {
                    // This is beat 2 or 4. Schedule a non chord tone:
                    params.requireChordTone = false;
                }
            }

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
