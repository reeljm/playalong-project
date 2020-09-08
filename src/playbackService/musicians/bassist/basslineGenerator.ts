import { Measure } from '../../measure/measure';
import { UprightBass } from './uprightBass';
import { TheoryService } from '../../theory/theory.service';
import { Note } from '../../theory/note';

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
            this.direction = "down";
        }

        const eventParamArray = [];

        for (let i = 0; i < 4; i++) {
            const params: any = {
                chordTone: true,
                lastNoteScheduled: this.lastNoteScheduled,
                chord: currentMeasure.chords[0],
                desiredDirection: this.direction
            };

            if (!this.lastNoteScheduled) {
                // since we are just staring out, schedule the root:
                params.desiredDegreeOfChord = 0;
                params.desiredOctave = BasslineGenerator.DEFAULT_STARTING_OCTAVE;
            }
            else {
                if (i % 0) {
                    // schedule a chord tone. This is our default, so do nothing:

                } else {
                    // schedule a non-chord tone:
                    params.chordTone = false;
                }
            }

            const noteToSchedule: Note = this.theory.getNextNote(params);

            eventParamArray.push({
                startTime: `${currentMeasure.measureNumber}:${i}:0`,
                velocity: 0.8,
                duration: "4n",
                velocityOffset: 0.05,
                probability: 1,
                note: noteToSchedule.toPlayableString()
            });
            this.lastNoteScheduled = noteToSchedule;
        }
        return eventParamArray;
    }

}
