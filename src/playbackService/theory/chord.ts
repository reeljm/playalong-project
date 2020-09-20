export class Chord {

    root: string;
    type: string;

    constructor(chordRoot: string, chordType: string) {
        this.root = chordRoot;
        this.type = chordType;
    }

    public equals(chord: Chord): boolean {
        return this.type === chord.type && this.root === chord.root;
    }
}
