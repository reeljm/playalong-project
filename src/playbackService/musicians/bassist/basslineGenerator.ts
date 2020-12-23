import { Note } from '../../theory/note';
import { Chord } from '../../theory/chord';
import { Theory } from '../../theory/theory';
import { Measure } from '../../song/measure';
import { BasslineCurrentState } from './basslineCurrentState';
import { BasslineRequestParams } from './basslineRequestParams';
import { BasslineRule } from './basslineRule';
import { DesiredScaleDegreeBasslineRule } from './desiredScaleDegreeBasslineRule';
import { ClosestScaleDegreeBasslineRule } from './closestScaleDegreeBasslineRule';
import { LastBeatOfCurrentChordBasslineRule } from './lastBeatOfCurrentChordBasslineRule';
import { EventParams } from '../drummer/eventParams';

export abstract class BasslineGenerator {

    private static DEFAULT_STARTING_OCTAVE: number = 2;
    private static DEFAULT_STARTING_DIRECTION: BasslineRequestParams.Dir = BasslineRequestParams.Dir.Up;

    constructor(protected theory: Theory) { }

    public gerenateBasslineEventParams(currentMeasure: Measure, basslineCurrentState: BasslineCurrentState): EventParams[] {
        if (!basslineCurrentState.currentOctave) {
            basslineCurrentState.currentOctave = BasslineGenerator.DEFAULT_STARTING_OCTAVE;
        }
        if (!basslineCurrentState.direction) {
            basslineCurrentState.direction = BasslineGenerator.DEFAULT_STARTING_DIRECTION;
        }

        const eventParamArray: EventParams[] = [];

        for (let currentBeat = 0; currentBeat < currentMeasure.numberOfBeats; currentBeat++) {
            const isLastNoteOfTune: boolean = !currentMeasure.nextMeasure;
            const params: BasslineRequestParams = new BasslineRequestParams();

            const currentChord: Chord = currentMeasure.chords[currentBeat];
            if (!basslineCurrentState.previousChord || basslineCurrentState.previousChord.equals(currentChord)) {
                basslineCurrentState.beatsAlreadySpentOnCurrentChord++;
            } else {
                basslineCurrentState.beatsAlreadySpentOnCurrentChord = 0;
            }
            this.configureBasslineParamsForNextNote(basslineCurrentState, currentMeasure, currentBeat, params);
            const noteToSchedule = this.getNextBasslineNote(params, basslineCurrentState);

            // Save info about this schedule cycle:
            basslineCurrentState.previousChord = currentChord;
            if (noteToSchedule) {
                basslineCurrentState.previousNoteScheduled = noteToSchedule;
                this.scheduleEventsForNote(currentMeasure, currentBeat, eventParamArray, noteToSchedule);
            }
            if (isLastNoteOfTune) {
                eventParamArray[eventParamArray.length - 1].duration = "4m";
                break;
            }
        }
        return eventParamArray;
    }

    protected abstract scheduleEventsForNote(
        currentMeasure: Measure,
        currentBeat: number,
        eventParamArray: EventParams[],
        noteToSchedule: Note
    ): void;

    protected abstract configureBasslineParamsForNextNote(
        basslineCurrentState: BasslineCurrentState,
        currentMeasure: Measure,
        currentBeat: number,
        params: BasslineRequestParams
    ): void;

    private getNextBasslineNote(params: BasslineRequestParams, basslineCurrentState: BasslineCurrentState): Note {
        const desiredScaleDegreeRule: BasslineRule = new DesiredScaleDegreeBasslineRule(this.theory);
        const lastBeatOfCurrentChordRule: BasslineRule = new LastBeatOfCurrentChordBasslineRule(this.theory);
        const closestScaleDegreeChordRule: BasslineRule = new ClosestScaleDegreeBasslineRule(this.theory);

        const rules: BasslineRule[] = [desiredScaleDegreeRule, lastBeatOfCurrentChordRule, closestScaleDegreeChordRule];

        if (params.rest) return;
        for (const rule of rules) {
            const res: any = rule.getMatch(params);
            if (res) {
                basslineCurrentState.direction = res.nextDirection;
                return res.note;
            }
        }
    }

}
