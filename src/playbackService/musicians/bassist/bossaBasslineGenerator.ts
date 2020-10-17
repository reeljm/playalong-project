import { Measure } from '../../song/measure';
import { Theory } from '../../theory/theory';
import { Note } from '../../theory/note';
import { BasslineRequestParams } from './basslineRequestParams';
import { Chord } from '../../theory/chord';
import { BasslineGenerator } from './basslineGenerator';
import { BasslineCurrentState } from './basslineCurrentState';

export class BossaBasslineGenerator extends BasslineGenerator {
    private playNextSkipBeat: boolean = true;
    private lastMeasureUtilized: number = null;

    constructor(theory: Theory) {
        super(theory);
    }

    protected scheduleEventsForNote(
        currentMeasure: Measure,
        currentBeat: number,
        eventParamArray: any[],
        noteToSchedule: Note
    ): void {
        const playCurrentSkipBeat: boolean = this.playNextSkipBeat;
        let noteDuration: string = "2n";
        this.playNextSkipBeat = Math.random() >= 0.1;
        if (this.playNextSkipBeat) {
            noteDuration = "4n.";
        }

        if (playCurrentSkipBeat && currentMeasure.numberOfBeats > 0) {
            const skipBeatDuration: string = "8n";
            if (this.lastMeasureUtilized && currentBeat === 0) {
                eventParamArray.push({
                    startTime: `${currentMeasure.arrangementMeasureNumber - 1}:${currentMeasure.numberOfBeats - 1}:2`,
                    velocity: 0.65,
                    duration: skipBeatDuration,
                    velocityOffset: 0,
                    probability: 1,
                    note: noteToSchedule.toPlayableString()
                });
            } else if (currentBeat === 2) {
                eventParamArray.push({
                    startTime: `${currentMeasure.arrangementMeasureNumber}:${currentBeat - 1}:2`,
                    velocity: 0.65,
                    duration: skipBeatDuration,
                    velocityOffset: 0,
                    probability: 1,
                    note: noteToSchedule.toPlayableString()
                });
            }
        }

        eventParamArray.push({
            startTime: `${currentMeasure.arrangementMeasureNumber}:${currentBeat}:0`,
            velocity: 0.8,
            duration: noteDuration,
            velocityOffset: 0,
            probability: 1,
            note: noteToSchedule.toPlayableString()
        });
        this.lastMeasureUtilized = currentMeasure.arrangementMeasureNumber;
    }

    protected configureBasslineParamsForNextNote(
        basslineCurrentState: BasslineCurrentState,
        currentMeasure: Measure,
        currentBeat: number,
        params: BasslineRequestParams
    ): void {
        if (this.lastMeasureUtilized < currentMeasure.arrangementMeasureNumber - 1) {
            this.lastMeasureUtilized = null;
        }

        if (currentBeat === 1) {
            // randomly choose to change direction:
            const dirSwitch = Math.random() >= 0.9;
            if (dirSwitch) {
                const up: BasslineRequestParams.Dir = BasslineRequestParams.Dir.Up;
                const down: BasslineRequestParams.Dir = BasslineRequestParams.Dir.Down;
                basslineCurrentState.direction = basslineCurrentState.direction === up ? down : up;
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

        // see if this is a special case:
        if (!basslineCurrentState.previousNoteScheduled || !nextChord) {
            // if we are starting or ending, schedule the root:
            params.desiredScaleDegree = 0;
            params.desiredOctave = 5
        } else if (currentBeat % currentMeasure.numberOfBeats === 0) {
            // this is a downbeat, schedule the root:
            params.desiredScaleDegree = 0;
            params.desiredOctave = basslineCurrentState.currentOctave;
        } else if (currentBeat % 2 === 0) {
            const scaleDegrees: number[] = [2, 4];
            const randomDegree = scaleDegrees[Math.floor(Math.random() * scaleDegrees.length)];
            params.desiredScaleDegree = randomDegree;
            params.desiredOctave = basslineCurrentState.currentOctave;
        } else {
            params.rest = true;
        }
    }

}
