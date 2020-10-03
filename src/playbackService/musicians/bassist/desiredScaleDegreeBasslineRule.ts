import { UprightBass } from './uprightBass';
import { TheoryService } from '../../theory/theory.service';
import { Note } from '../../theory/note';
import { BasslineRequestParams } from './basslineRequestParams';
import { BasslineResponseParams } from './basslineResponseParams';
import { Scale } from '../../theory/scale';
import { BasslineRule } from './basslineRule';

export class DesiredScaleDegreeBasslineRule implements BasslineRule {

    constructor(private theory: TheoryService) { }

    public getMatch(params: BasslineRequestParams): any {
        const scale: Scale = this.theory.getScaleForChord(params.currentChord);
        let directionChange = false;

        let nextNote: Note = null;
        if (params.desiredScaleDegree != null) {
            // if we know what scale degree we want to play, just pick it out from the scale:
            const indexInScale = params.desiredScaleDegree;
            nextNote = this.theory.getNote(scale.pitches[indexInScale], params.desiredOctave);

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
}
