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
}
