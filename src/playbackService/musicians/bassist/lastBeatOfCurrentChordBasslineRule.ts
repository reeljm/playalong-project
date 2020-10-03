import { UprightBass } from './uprightBass';
import { TheoryService } from '../../theory/theory.service';
import { Note } from '../../theory/note';
import { BasslineRequestParams } from './basslineRequestParams';
import { BasslineResponseParams } from './basslineResponseParams';
import { Scale } from '../../theory/scale';
import { BasslineRule } from './basslineRule';

export class LastBeatOfCurrentChordBasslineRule implements BasslineRule {

    constructor(private theory: TheoryService) { }

    public getMatch(params: BasslineRequestParams): any {

        // this is the last beat of the current chord. recalculate a more graceful resolution to next chord:
        if (params.isLastBeatOfCurrentChord || params.nextBeatIsStrongBeat) {
            const currentOctave = params.previousNoteScheduled.octave;
            const lastNote = params.previousNoteScheduled;
            let directionChange: boolean = false;
            let nextNote: Note = null;
            const scale: Scale = this.theory.getScaleForChord(params.currentChord);
            const nextScale: Scale = this.theory.getScaleForChord(params.nextChord);

            // pick which note we want to target:
            const rootOfNextChord: Note = this.theory.getNoteInClosestOctave(nextScale.pitches[0], lastNote);
            const fifthOfNextChord: Note = this.theory.getNoteInClosestOctave(nextScale.pitches[4], lastNote);

            const distanceToNextRoot: number = lastNote.distanceTo(rootOfNextChord);
            const distanceToNextFifth: number = lastNote.distanceTo(fifthOfNextChord);

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
            let nextDirection = params.desiredDirection;
            if (distanceFromLastNoteToTargetNote === 2) {
                // whole step below next target, schedule half step above:
                nextNote = this.theory.transpose(targetNote, -1);
                nextDirection = "up";
            } else if (distanceFromLastNoteToTargetNote === -2) {
                // whole step above next target, schedule half step below:
                nextNote = this.theory.transpose(targetNote, 1);
                nextDirection = "down";
            } else if (distanceFromLastNoteToTargetNote === 1) {
                // halfstep step below next target, schedule half step above:
                nextNote = this.theory.transpose(targetNote, 1);
                nextDirection = "down";
            } else if (distanceFromLastNoteToTargetNote === -1) {
                // halfstep step above next target, schedule half step below:
                nextNote = this.theory.transpose(targetNote, -1);
                nextDirection = "up";
            } else if (distanceFromLastNoteToTargetNote === 0) {
                if (params.desiredDirection === "up") {
                    nextNote = this.theory.transpose(targetNote, 1);
                    nextDirection = "down";
                }
                else if (params.desiredDirection === "down") {
                    nextNote = this.theory.transpose(targetNote, -1);
                    nextDirection = "up";
                }
            } else {
                // we have a distance larger than a whole step, pick the closest scale degree:

                // check if the target note is in our currrent scale:
                if (scale.pitches.includes(targetNote.pitch)) {
                    let indexCurrentScale = scale.pitches.indexOf(targetNote.pitch);
                    if (indexCurrentScale > 0) {
                        if (distanceFromLastNoteToTargetNote > 0) {
                            indexCurrentScale = indexCurrentScale - 1;
                            nextDirection = "up";
                        } else {
                            indexCurrentScale = indexCurrentScale + 1;
                            nextDirection = "down";
                        }
                        nextNote = this.theory.getNoteInClosestOctave(scale.pitches[indexCurrentScale], targetNote);
                    } else {
                        if (distanceFromLastNoteToTargetNote > 0) {
                            nextNote = this.theory.transpose(targetNote, -1);
                            nextDirection = "up";
                        } else {
                            nextNote = this.theory.transpose(targetNote, + 1);
                            nextDirection = "down";
                        }
                    }
                }
            }

            directionChange = false;
            if (params.desiredDirection !== nextDirection) {
                directionChange = true;
            }

            // make sure the note is within the instrument's range:
            while (nextNote.compareTo(UprightBass.HIGHEST_NOTE) === 1) {
                nextNote = Note.getNote(nextNote.pitch, nextNote.octave - 1);
                directionChange = true;
            }

            while (nextNote.compareTo(UprightBass.LOWEST_NOTE) === -1) {
                nextNote = Note.getNote(nextNote.pitch, nextNote.octave + 1);
                directionChange = true;
            }

            const response = BasslineResponseParams.createBasslineResponseParams();
            response.notesScheduled = [nextNote];
            response.directionChange = directionChange;
            return response;
        }
    }

    private distanceIsMajorOrMinor3rdInDesiredDirection(noteDistance: number, desiredDirection: string): boolean {
        if (desiredDirection === "up" && (noteDistance === 3 || noteDistance === 4)) {
            return true;
        } else if (desiredDirection === "down" && (noteDistance === -3 || noteDistance === -4)) {
            return true;
        }
        return false;
    }

}
