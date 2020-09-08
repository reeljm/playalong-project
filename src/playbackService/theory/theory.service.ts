import rawChordsToScales from '../staticFiles/chordsToScales.json';
import { Scale } from './scale';
import { Note } from './note';

export class TheoryService {
    
    private chordsToScales = (rawChordsToScales as any);
    
    public getNextNote(params: any): Note {
        console.log(params);
        if (params.desiredDegreeOfChord != null) {
            // TODO: need to update the chord object to contain intervals.
            //Likely need to do the same thing that I did with scales....
            // return this.getNote(params.chord[params.desiredDegreeOfChord], params.desiredOctave);
            return this.getNote(params.chord.root, params.desiredOctave);
        }

        // use lastNoteScheduled, chordTone, scale, and desiredDirection to get the next note:
        const root: string = params.chord.root;
        const scaleType: string = this.chordsToScales[params.chord.type];
        const scale: Scale = this.getScale(root, scaleType);
        
        return this.getNote("F#", 5);
    }
    
    private getNote(pitch: string, octave: number): Note {
        return Note.getNote(pitch, octave);
    }

    private getScale(root: string, scaleType: string): Scale {
        return Scale.getScale(root, scaleType);
    }
}
