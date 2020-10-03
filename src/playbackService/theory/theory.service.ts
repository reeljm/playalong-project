import rawChordsToScales from '../staticFiles/chordsToScales.json';
import { Scale } from './scale';
import { Note } from './note';
import { MusicUtility } from './pitchArray';
import { Chord } from './chord';

export class TheoryService {

    private chordsToScales = (rawChordsToScales as any);

    public transpose(note: Note, semitones: number): Note {
        let pitchIndex = MusicUtility.pitchArray.indexOf(note.pitch);
        let currentOctave = note.octave;
        const numberOfTones = MusicUtility.pitchArray.length;
        while (semitones !== 0) {
            if (semitones < 0) {
                pitchIndex = pitchIndex - 1;
                semitones++;
            } else if(semitones > 0) {
                pitchIndex = pitchIndex + 1;
                semitones--;
            }

            if (pitchIndex < 0) {
                pitchIndex = numberOfTones - 1;
                currentOctave--;
            } else if (pitchIndex > numberOfTones - 1) {
                pitchIndex = 0;
                currentOctave++;
            }
        }
        return this.getNote(MusicUtility.pitchArray[pitchIndex], currentOctave);
    }

    public getNoteInClosestOctave(pitch: string, note: Note): Note {
        const lowerOctaveNote: Note = this.getNote(pitch, note.octave-1);
        const currentOctaveNote: Note = this.getNote(pitch, note.octave);
        const higherOctaveNote: Note = this.getNote(pitch, note.octave+1);

        const lowerOctaveDist = Math.abs(this.distanceTo(lowerOctaveNote, note));
        const currentOctaveDist = Math.abs(this.distanceTo(currentOctaveNote, note));
        const higherOctaveDist = Math.abs(this.distanceTo(higherOctaveNote, note));

        const min = Math.min(lowerOctaveDist, currentOctaveDist, higherOctaveDist);
        if (min === lowerOctaveDist) {
            return lowerOctaveNote;
        }
        else if (min === currentOctaveDist) {
            return currentOctaveNote;
        }
        else if (min === higherOctaveDist) {
            return higherOctaveNote;
        }
    }

    public getNote(pitch: string, octave: number): Note {
        return Note.getNote(this.parseEnharmonicPitch(pitch), octave);
    }

    public getScale(root: string, scaleType: string): Scale {
        return Scale.getScale(root, scaleType);
    }

    public getScaleForChord(chord: Chord): Scale {
        const root: string = this.parseEnharmonicPitch(chord.root);
        const scaleType: string = this.chordsToScales[chord.type];
        return this.getScale(root, scaleType);
    }

    public distanceTo(note1: Note, note2: Note): number {
        const curPitch: string = note1.pitch;
        const otherPitch: string = note2.pitch;
        const curOct: number = note1.octave;
        const otherOct: number = note2.octave;

        const curPitchIndex: number = MusicUtility.pitchArray.indexOf(curPitch);
        const otherPitchIndex: number = MusicUtility.pitchArray.indexOf(otherPitch);

        return otherPitchIndex - curPitchIndex + 12 * (otherOct - curOct);
    }

    public parseEnharmonicPitch(pitch: string): string {
        if (MusicUtility.pitchArray.includes(pitch)) {
            return pitch;
        }
        const tokenizedPitch: string[] = pitch.split("");
        let currentNoteIndex: number = MusicUtility.pitchArray.indexOf(tokenizedPitch[0]);
        tokenizedPitch.shift();
        while (tokenizedPitch.length > 0) {
            const sharpOrFlat = tokenizedPitch[0];
            if (sharpOrFlat === "#") {
                currentNoteIndex++;
            } else if (sharpOrFlat === "b") {
                currentNoteIndex--;
            }

            // handle out of bounds cases:
            if (currentNoteIndex === -1) {
                currentNoteIndex = 11;
            } else if (currentNoteIndex === 12) {
                currentNoteIndex = 0;
            }
            tokenizedPitch.shift();
        }
        const parsedNote = MusicUtility.pitchArray[currentNoteIndex];
        return parsedNote;
    }
}
