import { MusicUtility } from "./pitchArray";

export class Note {

    private static lowestOctave: number = 1
    private static highestOctave: number = 10

    pitch: string;
    octave: number;

    private constructor(pitch: string, octave: number) {
        this.pitch = pitch;
        this.octave = octave;
    }

    public static getNote(pitch: string, octave: number): Note {
        pitch = pitch.toUpperCase();
        if (!MusicUtility.pitchArray.includes(pitch)) {
            return null;
        }

        // make sure the note is within the valid note range
        const arr = [Note.lowestOctave, octave, Note.highestOctave].sort((n1,n2) => n1 - n2);
        return new Note(pitch, arr[1]);
    }

    public toPlayableString() {
        return `${this.pitch}${this.octave}`;
    }


    public compareTo(otherNote: Note): number {
        if (this.pitch === otherNote.pitch && this.octave === otherNote.octave) {
            return 0;
        } else if (this.octave > otherNote.octave ||
            (this.octave === otherNote.octave &&
                MusicUtility.pitchArray.indexOf(this.pitch) > MusicUtility.pitchArray.indexOf(otherNote.pitch))) {
            return 1;
        } else {
            return -1;
        }
    }

    public distanceTo(otherNote: Note): number {
        const curPitch: string = this.pitch;
        const otherPitch: string = otherNote.pitch;
        const curOct: number = this.octave;
        const otherOct: number = otherNote.octave;

        const curPitchIndex: number = MusicUtility.pitchArray.indexOf(curPitch);
        const otherPitchIndex: number = MusicUtility.pitchArray.indexOf(otherPitch);

        return otherPitchIndex - curPitchIndex + 12 * (otherOct - curOct);
    }

}
