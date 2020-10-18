export class Chord {

    root: string;
    type: string;

    writtenRoot: string;

    private constructor(chordRoot: string, chordType: string) {
        this.root = chordRoot;
        this.type = chordType;
    }

    public static getChord(root: string, type: string): Chord {
        return new Chord(root, type);
    }

    public equals(chord: Chord): boolean {
        return this.type === chord.type && this.root === chord.root;
    }
}
