import { UprightBass } from './uprightBass';
import { Theory } from '../../theory/theory';
import { Note } from '../../theory/note';
import { BasslineRequestParams } from './basslineRequestParams';
import { Scale } from '../../theory/scale';
import { BasslineRule } from './basslineRule';

export class ClosestScaleDegreeBasslineRule implements BasslineRule {

    constructor(private theory: Theory) { }

    public getMatch(params: BasslineRequestParams): any {
        const scale: Scale = this.theory.getScaleForChord(params.currentChord);
        let nextDirection: BasslineRequestParams.Dir = params.desiredDirection;

        let nextNote: Note = null;
        // use lastNoteScheduled, chordTone, scale, and desiredDirection to get the next note:
        const currentOctave = params.previousNoteScheduled.octave;
        const lastNote = params.previousNoteScheduled;

        let possibleIntervals: number[] = null
        if (params.requireRoot) {
            possibleIntervals = [0,4];
        } else {
            possibleIntervals = Array.from(Array(scale.pitches.length).keys());
        }

        // go through these notes in the octacve-1, octacve, and octacve+1 to see which note is closest:
        let chordToneNotesAndDistances: any[] = [];
        for (let octave = currentOctave - 1; octave <= currentOctave + 1; octave++) {
            possibleIntervals.forEach(interval => {
                const note: Note = this.theory.getNote(scale.pitches[interval], octave);
                const dist: number = this.theory.distanceTo(lastNote, note);
                const noteAndDist = {note: note, dist: dist};
                chordToneNotesAndDistances.push(noteAndDist);
            });
        }

        const up: BasslineRequestParams.Dir = BasslineRequestParams.Dir.Up;
        const down: BasslineRequestParams.Dir = BasslineRequestParams.Dir.Down;
        // filter out notes that violate our direction requirement:
        chordToneNotesAndDistances = chordToneNotesAndDistances.filter(noteAndDistance => {
            if (params.desiredDirection === up && noteAndDistance.dist > 0) {
                return true;
            } else if (params.desiredDirection === down && noteAndDistance.dist < 0) {
                return true;
            } else {
                return false;
            }
        });

        // select the note that is closest:
        const sortFunc = (nd1: any, nd2:any) => Math.abs(nd1.dist) - Math.abs(nd2.dist);
        chordToneNotesAndDistances = chordToneNotesAndDistances.sort(sortFunc);
        nextNote = chordToneNotesAndDistances[0].note;

        // make sure the note is within the instrument's range:
        while (this.theory.distanceTo(nextNote, UprightBass.HIGHEST_NOTE) < 0) {
            nextNote = Note.getNote(nextNote.pitch, nextNote.octave - 1);
            nextDirection = down;
        }

        while (this.theory.distanceTo(nextNote, UprightBass.LOWEST_NOTE) > 0) {
            nextNote = Note.getNote(nextNote.pitch, nextNote.octave + 1);
            nextDirection = up;
        }

        return {note: nextNote, nextDirection: nextDirection};
    }
}
