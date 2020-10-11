import { Measure } from '../../song/measure';
import { Theory } from '../../theory/theory';
import { Note } from '../../theory/note';
import { BasslineRequestParams } from './basslineRequestParams';
import { Chord } from '../../theory/chord';
import { BasslineGenerator } from './basslineGenerator';
import { BasslineCurrentState } from './basslineCurrentState';

export class WalkingBasslineGenerator extends BasslineGenerator {

    private static DIFFICULT_CHORD_TYPES: string[] = ["min7b5", "dim7", "7b9"];

    constructor(theory: Theory) {
        super(theory);
    }

    protected scheduleEventsForNote(currentMeasure: Measure, currentBeat: number, eventParamArray: any[], noteToSchedule: Note): void {
        const noteDuration: string = "4n";
        eventParamArray.push({
            startTime: `${currentMeasure.measureNumber}:${currentBeat}:0`,
            velocity: 0.8,
            duration: noteDuration,
            velocityOffset: 0,
            probability: 1,
            note: noteToSchedule.toPlayableString()
        });
    }

    protected configureBasslineParamsForNextNote(basslineCurrentState: BasslineCurrentState, currentMeasure: Measure, currentBeat: number, params: BasslineRequestParams): void {
        if (currentBeat === 1) {
            // randomly choose to change direction:
            const dirSwitch = Math.random() >= 0.9;
            if (dirSwitch) {
                basslineCurrentState.direction = basslineCurrentState.direction === "up" ? "down" : "up";
            }
        }

        const currentChord: Chord = currentMeasure.chords[currentBeat];
        let nextChord: Chord = null;
        if (currentBeat === currentMeasure.numberOfBeats - 1) {
            nextChord = currentMeasure.nextMeasure ? currentMeasure.nextMeasure.chords[0] : null;
        } else {
            nextChord = currentMeasure.chords[currentBeat + 1];
        }

        params.previousNoteScheduled = basslineCurrentState.previousNoteScheduled;
        params.previousChord = basslineCurrentState.previousChord;
        params.currentChord = currentChord;
        params.nextChord = nextChord;
        params.desiredDirection = basslineCurrentState.direction;
        params.beatsAlreadySpentOnCurrentChord = basslineCurrentState.beatsAlreadySpentOnCurrentChord;
        params.nextBeatIsStrongBeat = currentBeat === currentMeasure.numberOfBeats - 1;
        params.isLastBeatOfCurrentChord = !currentChord.equals(nextChord);
        params.requireRoot = false;

        const isDifficultChord = WalkingBasslineGenerator.DIFFICULT_CHORD_TYPES.includes(currentChord.type);

        // see if this is a special case:
        if (!basslineCurrentState.previousNoteScheduled || !nextChord) {
            // if we are starting or ending, schedule the root:
            params.desiredScaleDegree = 0;
            params.desiredOctave = basslineCurrentState.currentOctave;
        } else if (currentBeat % currentMeasure.numberOfBeats === 0) {
            // this is a downbeat, schedule the root:
            params.requireRoot = true;
        } else if (isDifficultChord) {
            const scaleDegrees: number[] = [0, 2, 4];
            const randomDegree = scaleDegrees[Math.floor(Math.random() * scaleDegrees.length)];
            params.desiredScaleDegree = randomDegree;
            params.desiredOctave = basslineCurrentState.currentOctave;
        }
    }
}
