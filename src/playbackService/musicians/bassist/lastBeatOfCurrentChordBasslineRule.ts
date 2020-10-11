import { UprightBass } from './uprightBass';
import { Theory } from '../../theory/theory';
import { Note } from '../../theory/note';
import { BasslineRequestParams } from './basslineRequestParams';
import { Scale } from '../../theory/scale';
import { BasslineRule } from './basslineRule';

export class LastBeatOfCurrentChordBasslineRule implements BasslineRule {

    constructor(private theory: Theory) { }

    public getMatch(params: BasslineRequestParams): any {
        
        // this is the last beat of the current chord. recalculate a more graceful resolution to next chord:
        if (params.isLastBeatOfCurrentChord || params.nextBeatIsStrongBeat) {
            const lastNote = params.previousNoteScheduled;
            let nextNote: Note = null;
            const scale: Scale = this.theory.getScaleForChord(params.currentChord);
            const nextScale: Scale = this.theory.getScaleForChord(params.nextChord);
            let nextDirection = params.desiredDirection;
            const up: BasslineRequestParams.Dir = BasslineRequestParams.Dir.Up;
            const down: BasslineRequestParams.Dir = BasslineRequestParams.Dir.Down;
            
            // pick which note we want to target:
            const rootOfNextChord: Note = this.theory.getNoteInClosestOctave(nextScale.pitches[0], lastNote);
            const fifthOfNextChord: Note = this.theory.getNoteInClosestOctave(nextScale.pitches[4], lastNote);

            const distanceToNextRoot: number = this.theory.distanceTo(lastNote, rootOfNextChord);
            const distanceToNextFifth: number = this.theory.distanceTo(lastNote, fifthOfNextChord);

            let targetNote: Note = null;
            let distanceFromLastNoteToTargetNote: number = 0;
            if (params.beatsAlreadySpentOnCurrentChord < 2) {
                // the current chord only lasts for 1 or 2 beats. we need to target the next root:
                targetNote = rootOfNextChord;
                distanceFromLastNoteToTargetNote = distanceToNextRoot;
            } else if (this.distanceIsMajorOrMinor3rdInDesiredDirection(distanceToNextRoot, params.desiredDirection)) {
                targetNote = rootOfNextChord;
                distanceFromLastNoteToTargetNote = distanceToNextRoot;
            } else if (this.distanceIsMajorOrMinor3rdInDesiredDirection(distanceToNextFifth, params.desiredDirection)) {
                targetNote = fifthOfNextChord;
                distanceFromLastNoteToTargetNote = distanceToNextFifth;
            } else if (Math.abs(distanceToNextRoot) <= Math.abs(distanceToNextFifth)) {
                // next root is equally close/closer than the next 5th:
                targetNote = rootOfNextChord;
                distanceFromLastNoteToTargetNote = distanceToNextRoot;
            } else {
                // next 5th is closer than the next root:
                targetNote = fifthOfNextChord;
                distanceFromLastNoteToTargetNote = distanceToNextFifth;
            }

            // set the next note to initially be the note we are targeting:
            if (distanceFromLastNoteToTargetNote === 2) {
                // whole step below next target, schedule half step above:
                nextNote = this.theory.transpose(targetNote, -1);
                nextDirection = up;
            } else if (distanceFromLastNoteToTargetNote === -2) {
                // whole step above next target, schedule half step below:
                nextNote = this.theory.transpose(targetNote, 1);
                nextDirection = down;
            } else if (distanceFromLastNoteToTargetNote === 1) {
                // halfstep step below next target, schedule half step above:
                nextNote = this.theory.transpose(targetNote, 1);
                nextDirection = down;
            } else if (distanceFromLastNoteToTargetNote === -1) {
                // halfstep step above next target, schedule half step below:
                nextNote = this.theory.transpose(targetNote, -1);
                nextDirection = up;
            } else if (distanceFromLastNoteToTargetNote === 0) {
                if (params.desiredDirection === up) {
                    nextNote = this.theory.transpose(targetNote, 1);
                    nextDirection = down;
                }
                else if (params.desiredDirection === down) {
                    nextNote = this.theory.transpose(targetNote, -1);
                    nextDirection = up;
                }
            } else {
                // we have a distance larger than a whole step, pick the closest scale degree:
                // check if the target note is in our currrent scale:
                let indexCurrentScale = scale.pitches.indexOf(targetNote.pitch);
                if (indexCurrentScale > 0) {
                    if (distanceFromLastNoteToTargetNote > 0) {
                        indexCurrentScale = indexCurrentScale - 1;
                        nextDirection = up;
                    } else {
                        indexCurrentScale = indexCurrentScale + 1;
                        nextDirection = down;
                    }
                    nextNote = this.theory.getNoteInClosestOctave(scale.pitches[indexCurrentScale], targetNote);
                } else {
                    if (distanceFromLastNoteToTargetNote > 0) {
                        nextNote = this.theory.transpose(targetNote, -1);
                        nextDirection = up;
                    } else {
                        nextNote = this.theory.transpose(targetNote, + 1);
                        nextDirection = down;
                    }
                }
            }

            // make sure the note is within the instrument's range:
            while (this.theory.distanceTo(nextNote, UprightBass.HIGHEST_NOTE) < 0) {
                nextNote = Note.getNote(nextNote.pitch, nextNote.octave - 1);
            }

            while (this.theory.distanceTo(nextNote, UprightBass.LOWEST_NOTE) > 0) {
                nextNote = Note.getNote(nextNote.pitch, nextNote.octave + 1);
            }

            return {note: nextNote, nextDirection: nextDirection};
        }
    }

    private distanceIsMajorOrMinor3rdInDesiredDirection(noteDistance: number, desiredDirection: BasslineRequestParams.Dir): boolean {
        const up: BasslineRequestParams.Dir = BasslineRequestParams.Dir.Up;
        const down: BasslineRequestParams.Dir = BasslineRequestParams.Dir.Down;
        if (desiredDirection === up && (noteDistance === 3 || noteDistance === 4)) {
            return true;
        } else if (desiredDirection === down && (noteDistance === -3 || noteDistance === -4)) {
            return true;
        }
        return false;
    }

}
