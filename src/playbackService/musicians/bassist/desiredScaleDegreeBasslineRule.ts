import { UprightBass } from './uprightBass';
import { Theory } from '../../theory/theory';
import { Note } from '../../theory/note';
import { BasslineRequestParams } from './basslineRequestParams';
import { Scale } from '../../theory/scale';
import { BasslineRule } from './basslineRule';

export class DesiredScaleDegreeBasslineRule implements BasslineRule {

    constructor(private theory: Theory) { }

    public getMatch(params: BasslineRequestParams): Note {
        const scale: Scale = this.theory.getScaleForChord(params.currentChord);
        let directionChange = false;

        let nextNote: Note = null;
        if (params.desiredScaleDegree != null) {
            // if we know what scale degree we want to play, just pick it out from the scale:
            const indexInScale = params.desiredScaleDegree;
            nextNote = this.theory.getNote(scale.pitches[indexInScale], params.desiredOctave);

            // make sure the note is within the instrument's range:
            while (this.theory.distanceTo(nextNote, UprightBass.HIGHEST_NOTE) < 0) {
                nextNote = Note.getNote(nextNote.pitch, nextNote.octave - 1);
                directionChange = true;
            }

            while (this.theory.distanceTo(nextNote, UprightBass.LOWEST_NOTE) > 0) {
                nextNote = Note.getNote(nextNote.pitch, nextNote.octave + 1);
                directionChange = true;
            }

            return nextNote;
        }
    }
}
