import { UprightBass } from './uprightBass';
import { TheoryService } from '../../theory/theory.service';
import { Note } from '../../theory/note';
import { BasslineRequestParams } from './basslineRequestParams';
import { Scale } from '../../theory/scale';
import { BasslineRule } from './basslineRule';
import { BasslineResponseParams } from './basslineResponseParams';

export class ClosestScaleDegreeBasslineRule implements BasslineRule {

    constructor(private theory: TheoryService) { }

    public getMatch(params: BasslineRequestParams): any {
        const scale: Scale = this.theory.getScaleForChord(params.currentChord);
        let directionChange = false;

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

        // go through these notes in the octave below, the current octave, and the octave above to see which note is closest:
        let chordToneNotesAndDistances: any[] = [];
        for (let octave = currentOctave - 1; octave <= currentOctave + 1; octave++) {
            possibleIntervals.forEach(interval => {
                const note: Note = this.theory.getNote(scale.pitches[interval], octave);
                const dist: number = this.theory.distanceTo(lastNote, note);
                const noteAndDist = {note: note, dist: dist};
                chordToneNotesAndDistances.push(noteAndDist);
            });
        }

        // filter out notes that violate our direction requirement:
        chordToneNotesAndDistances = chordToneNotesAndDistances.filter(noteAndDistance => {
            if (params.desiredDirection === "up" && noteAndDistance.dist > 0) {
                return true;
            } else if (params.desiredDirection === "down" && noteAndDistance.dist < 0) {
                return true;
            } else {
                return false;
            }
        });

        // select the note that is closest:
        chordToneNotesAndDistances = chordToneNotesAndDistances.sort((nd1,nd2) => Math.abs(nd1.dist) - Math.abs(nd2.dist));
        nextNote = chordToneNotesAndDistances[0].note;

        // make sure the note is within the instrument's range:
        while (this.theory.distanceTo(nextNote, UprightBass.HIGHEST_NOTE) < 0) {
            nextNote = Note.getNote(nextNote.pitch, nextNote.octave - 1);
            directionChange = true;
        }

        while (this.theory.distanceTo(nextNote, UprightBass.LOWEST_NOTE) > 0) {
            nextNote = Note.getNote(nextNote.pitch, nextNote.octave + 1);
            directionChange = true;
        }

        const response = BasslineResponseParams.createBasslineResponseParams();
        response.notesScheduled = [nextNote];
        response.directionChange = directionChange;
        return response;
    }
}
