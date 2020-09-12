import rawChordsToScales from '../staticFiles/chordsToScales.json';
import { Scale } from './scale';
import { Note } from './note';
import { BasslineRequestParams } from '../musicians/bassist/basslineRequestParams';
import { BasslineResponseParams } from '../musicians/bassist/basslineResponseParams';

export class TheoryService {

    private chordsToScales = (rawChordsToScales as any);

    public getNextBasslineNote(params: BasslineRequestParams): BasslineResponseParams {
        console.log(params);

        const root: string = params.chord.root;
        const scaleType: string = this.chordsToScales[params.chord.type];
        const scale: Scale = this.getScale(root, scaleType);

        let nextNote: Note = null;
        if (params.desiredDegreeOfChord != null) {
            // if we know what scale degree we want to play, just pick it out from the scale
            const indexInScale = params.desiredDegreeOfChord - 1;
            nextNote = this.getNote(scale.pitches[indexInScale], params.desiredOctave);
        } else {
            // use lastNoteScheduled, chordTone, scale, and desiredDirection to get the next note:
            const currentOctave = params.lastNoteScheduled.octave;

            const scaleDegree = scale.pitches[0];

            nextNote = this.getNote(scaleDegree, currentOctave);
            const comp = nextNote.compareTo(params.lastNoteScheduled);
            if (comp === -1 && params.desiredDirection === "up") {
                nextNote = this.getNote(scaleDegree, currentOctave + 1);
            } else if (comp === 1 && params.desiredDirection === "down") {
                nextNote = this.getNote(scaleDegree, currentOctave - 1);
            }
        }

        let directionChange = false;
        // make sure the note is within the instrument's range:
        while (nextNote.compareTo(params.highestNote) === 1) {
            nextNote = Note.getNote(nextNote.pitch, nextNote.octave - 1);
            directionChange = true;
        }

        while (nextNote.compareTo(params.lowestNote) === -1) {
            nextNote = Note.getNote(nextNote.pitch, nextNote.octave + 1);
            directionChange = true;
        }

        const response = this.newBasslineResponseParams();
        response.noteScheduled = nextNote;
        response.directionChange = directionChange;
        return response;
    }

    private newBasslineResponseParams(): BasslineResponseParams {
        return new BasslineResponseParams();
    }

    private getNote(pitch: string, octave: number): Note {
        return Note.getNote(pitch, octave);
    }

    private getScale(root: string, scaleType: string): Scale {
        return Scale.getScale(root, scaleType);
    }
}
