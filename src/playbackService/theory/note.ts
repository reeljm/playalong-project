const pitches = ["A","A#","B","C","C#","D","D#","E","F","F#","G","G#"];
const lowestOctave: number = 1
const highestOctave: number = 10

export class Note {

    pitch: string;
    octave: number;

    private constructor(pitch: string, octave: number) {
        this.pitch = pitch;
        this.octave = octave;
    }

    public static getNote(pitch: string, octave: number): Note {
        pitch = pitch.toUpperCase();
        if (!pitches.includes(pitch)) {
            return null;
        }
        if (octave > lowestOctave && octave < highestOctave - 1) {
            return new Note(pitch, octave);
        }
    }

    public toPlayableString() {
        return `${this.pitch}${this.octave}`;
    }

    // public compareNotes(note1: Note, note2: Note): number {
    //     if (note1.pitch == note2.pitch && note1.octave == note2.octave) {
    //         return 0;
    //     } else if (note1.octave > note2.octave ||
    //         (note1.octave == note2.octave &&
    //             TheoryService.pitchArray.indexOf(note1.pitch) > TheoryService.pitchArray.indexOf(note2.pitch))) {
    //         return 1
    //     } else {
    //         return -1;
    //     }
    // }
}
